using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Server.DTOs;
using Server.Exceptions;
using Server.Extentions;
using Server.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Services
{
    public class StudentService
    {
        private readonly RasporedContext _context;
        private GroupService groupService;
        private ScheduleService scheduleService;

        public StudentService(RasporedContext context, GroupService GroupsService, ScheduleService scheduleService)
        {
            _context = context;
            this.groupService = GroupsService;
            this.scheduleService = scheduleService;
        }

        public IEnumerable GetAllStudents()
        {
            return _context.Students.Include(a => a.UniMembers).ToList();

        }

        public IEnumerable GetStudentsOfDepartment(int DepartmentId)
        {
            var r = (from stud in _context.Students.Include(a => a.UniMembers)
                     where stud.DepartmentId == DepartmentId
                     select stud).OrderBy(a => a.IndexNumber).ToList();

            return JsonConvert.SerializeObject(r, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

        }

        public Object GetStudent(int uniMemberId)
        {
            return _context.Students.Include(a => a.UniMembers).First(a => a.UniMembers.UniMemberId == uniMemberId);
        }

        public string GetStudentName(int StudentId)
        {
            return _context.Students.Where(a => a.StudentId == StudentId)
                .Select(a => a.UniMembers.Name + " " + a.UniMembers.Surname).First();
        }

        public string GetStudentName(Students a)
        {
            return a.UniMembers.Name + " " + a.UniMembers.Surname;
        }

        public IEnumerable GetStudentsOfGroup(int GroupId)
        {
            //ne znam zasto nece kad se select ubaci u prvi upit  a hoce kad se odvojji
            var pom =
                _context.GroupsStudents.Include(a => a.Student)
                    .ThenInclude(a => a.UniMembers)
                    .Where(a => a.GroupId == GroupId)
                    .ToList();
            return (from a in pom select a.Student).OrderBy(a => a.IndexNumber).ToList();
        }

        public List<Students> GetStudentsOfCourse(int CourseId)
        {
            return (from s in _context.Students
                .Include(a => a.UniMembers)
                    from sc in _context.StudentsCourses
                    where s.StudentId == sc.StudentId && sc.CourseId == CourseId
                    select s).ToList();
        }




        public IEnumerable GetSchedule(int StudentId, int weeksFromNow = 0, bool official = false)
        {
            DateTime now = DateTime.Now.AddDays(7 * weeksFromNow);
            TimeSpans tsNow = new TimeSpans
            {
                StartDate = now.StartOfWeek(),
                EndDate = now.EndOfWeek()
            };
            List<int> Groups = _context.GroupsStudents
                .Where(a => a.StudentId == StudentId &&
                            (!official || a.FalseMember != true) &&
                            (official || a.Ignore != true) &&
                            TimeSpan.DatesOverlap(a.Group.Division.Beginning, a.Group.Division.Ending, tsNow.StartDate, tsNow.EndDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
                            .Select(a => a.GroupId).ToList();

            List<ScheduleDTO> GroupsSchedule = _context.Groups.Where(a => Groups.Contains(a.GroupId) && TimeSpan.Overlap(a.TimeSpan, tsNow))
                    .Select(a => new ScheduleDTO
                    {
                        Day = ((DateTime)a.TimeSpan.StartDate).DayOfWeek,
                        StartMinutes = (int)((DateTime)a.TimeSpan.StartDate).TimeOfDay.TotalMinutes,
                        DurationMinutes = (int)(((DateTime)a.TimeSpan.EndDate).Subtract(((DateTime)a.TimeSpan.StartDate))).TotalMinutes,
                        ClassName = a.Division.Course.Name,
                        Abbr = a.Division.Course.Alias,
                        Classroom = a.Classroom.Number,
                        Type = a.Division.DivisionType.Type,
                        Color = groupService.GetNextColor(a.Division.Course.Name),
                        IsClass = true,
                        GroupId = a.GroupId,
                        Assistant = groupService.GetAssistant(a.Assistant),
                    }).ToList();

            GroupsSchedule.ForEach(a => a.Active = groupService.IsActive(a.GroupId, tsNow));
            GroupsSchedule.ForEach(a => a.Notifications = GetClassNotification(StudentId, a.GroupId, tsNow));


            List<int> activities = official ? new List<int>() :
                _context.StudentsActivities.Where(a => a.StudentId == StudentId && a.Ignore != true).Select(a => a.ActivityId).ToList();

            List<ScheduleDTO> activitiesSchedule =
                _context.Activities.Where(a => (activities.Contains(a.ActivityId) ||
                                                (a.GroupId != null && a.Cancelling == false && Groups.Contains(a.GroupId.Value)) ||
                                                (!a.StudentsActivities.Any() && a.GroupId == null))
                                                && TimeSpan.Overlap(a.TimeSpan, tsNow)) //nisu obavestenja vezana za casove
                                                .Select(a => new ScheduleDTO
                                                {
                                                    Day = a.TimeSpan.StartDate.DayOfWeek,
                                                    StartMinutes = (int)a.TimeSpan.StartDate.TimeOfDay.TotalMinutes,
                                                    DurationMinutes = (int)(a.TimeSpan.EndDate.Subtract(a.TimeSpan.StartDate)).TotalMinutes,
                                                    Active = true,
                                                    Color = groupService.GetNextColor(a.Title),
                                                    ActivityTitle = a.Title,
                                                    ActivityContent = a.ActivityContent,
                                                    IsClass = false,
                                                    ActivityId = a.ActivityId,
                                                    Assistant = groupService.GetAssistant(a.Assistant),
                                                    Classroom = a.Classroom.Number,
                                                    Place = a.Place
                                                }).ToList();

            List<ScheduleDTO> returnValue = GroupsSchedule.Concat(activitiesSchedule).ToList();


            return scheduleService.Convert(returnValue);
        }


        public IEnumerable GetPersonalSchedule(int StudentId, int weeksFromNow = 0)
        {
            return GetSchedule(StudentId, weeksFromNow, false);
        }

        public IEnumerable GetOfficialSchedule(int StudentId, int weeksFromNow = 0)
        {
            return GetSchedule(StudentId, weeksFromNow, true);
        }

        public List<NotificationDTO> GetClassNotification(int StudentId, int GroupId, TimeSpans ts)
        {
            List<NotificationDTO> StudentsNotifications = _context.StudentsActivities.Where(ac =>
                ac.StudentId == StudentId &&
                ac.Activity.GroupId == GroupId &&
                TimeSpan.TimeSpanOverlap(ac.Activity.TimeSpan, ts))
                .Select(ac => new NotificationDTO
                {
                    ActivityId = ac.ActivityId,
                    ActivityContent = ac.Activity.ActivityContent,
                    Title = ac.Activity.Title,
                    ClassroomId = ac.Activity.ClassroomId,
                    Place = ac.Activity.Place
                }).ToList();

            List<NotificationDTO> GroupsNotifications = groupService.GetNotifications(GroupId, ts);

            return StudentsNotifications.Concat(GroupsNotifications).ToList();

        }


        /// <summary>
        /// Proverava da li je Student slobodan u to vreme.
        /// </summary>
        /// <param Name="StudentId"></param>
        /// <param Name="ts"></param>
        /// <param Name="GroupId">Groupa ciji ce se cas izuzeti pri proveri</param>
        /// <returns></returns>
        public bool CheckIfAvailable(int StudentId, TimeSpans ts, int? GroupId = null)
        {


            List<int> Groups = _context.GroupsStudents
                .Where(a => a.StudentId == StudentId &&
                            (GroupId == null || a.GroupId != GroupId) &&
                            TimeSpan.DatesOverlap(a.Group.Division.Beginning, a.Group.Division.Ending, ts.StartDate, ts.EndDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
                            .Select(a => a.GroupId).ToList();

            var GroupsSchedulePom =
                _context.Groups.Where(a => Groups.Contains(a.GroupId)).ToList();
            List<TimeSpans> GroupsSchedule = GroupsSchedulePom.Where(a => a.TimeSpan != null && groupService.IsActive(a.GroupId, ts)).Select(a => a.TimeSpan).ToList();


            List<int> activities =
                _context.StudentsActivities.Where(a => a.StudentId == StudentId && a.Ignore != true).Select(a => a.ActivityId).ToList();
            List<TimeSpans> activitiesSchedule =
                _context.Activities.Where(
                    a => activities.Contains(a.ActivityId) || (a.GroupId != null && a.Cancelling == false && Groups.Contains(a.GroupId.Value)))
                    .Select(a => a.TimeSpan)
                    .ToList();

            List<TimeSpans> schedule = GroupsSchedule.Concat(activitiesSchedule).ToList();

            return ts == null || schedule.All(timeSpan => !Server.Services.TimeSpan.Overlap(timeSpan, ts));

        }


        public bool CheckIfAvailable(TimeSpans ts, List<int> Students, int? GroupId = null)
        {
            if (ts == null)
                return true;

            var unaveliable = _context.Students
                .Where(a => Students.Contains(a.StudentId) && !CheckIfAvailable(a.StudentId, ts, GroupId))
                 .Select(a => a.UniMembers.Name + " " + a.UniMembers.Surname).ToList();

            if (unaveliable.Any())
            {
                string exp = unaveliable.Count() > 1
                    ? "Studenti nisu slobodni u vreme kada grupa ima cas"
                    : "Student nije slobodan u vreme kada grupa ima cas";
                exp += " (" + TimeSpan.ToString(ts) + ").\n";
                exp += String.Join("\n", unaveliable);
                throw new InconsistentDivisionException(exp);
            }

            return true;


        }

        // provera da li studend moze biti dodan u grupu
        public void TryAddToGroup(int StudentId, int GroupId)
        {


            //proveri da li dolazi do nekonzistentnosti raspodele
            //provera da li Student vec postoji u toj grupi
            var otherStuds =
                _context.GroupsStudents.Where(a => a.GroupId == GroupId).Select(a => a.StudentId).ToList();
            if (otherStuds.Contains(StudentId))
            {
                throw new InconsistentDivisionException("Student već pripada toj grupi.");
            }

            //proverva konzistentnost sa ostalim grupama, bacice exeption ako nije
            groupService.CheckConsistencyWithOtherGroups(GroupId, new List<int>() { StudentId });

            //provera da li je Student slobodan u vreme kada ta grupa ima cas
            TimeSpans GroupTs = _context.Groups.Where(a => a.GroupId == GroupId).Select(a => a.TimeSpan).First();
            if (GroupTs != null && !CheckIfAvailable(StudentId, GroupTs))
            {
                string Name = GetStudentName(StudentId);
                string message = "Student (" + Name + ") nije slobodan u vreme kada grupa ima cas";
                message += " (" + TimeSpan.ToString(GroupTs) + " ).";
                throw new InconsistentDivisionException(message);
            }

        }

        public void AddToGroup(int StudentId, int GroupId)
        {


            // provera da li dolazi do nekonzistentnosti
            TryAddToGroup(StudentId, GroupId);

            GroupsStudents gs = new GroupsStudents
            {
                GroupId = GroupId,
                StudentId = StudentId
            };
            _context.GroupsStudents.Add(gs);

        }

        // brise Studenta iz svih grupa raspodele DivisionId
        public void RemoveFromAllGroups(int StudentId, int DivisionId)
        {


            var groupStudents =
                    _context.GroupsStudents.Where(a => a.StudentId == StudentId && a.Group.DivisionId == DivisionId)
                        .ToList();

            foreach (GroupsStudents gs in groupStudents)
            {
                _context.GroupsStudents.Remove(gs);
            }
        }

        // prebacuje Studenta u grupu
        // birse ga iz svih ostalih grupa te raspodele i ubacuje u GroupId
        public void MoveToGroup(int StudentId, int GroupId)
        {
            int DivisionId = _context.Groups.Where(a => a.GroupId == GroupId).Select(a => a.DivisionId).First();

            var GroupStudents =
                    _context.GroupsStudents.Where(a => a.StudentId == StudentId && a.Group.DivisionId == DivisionId)
                        .ToList();

            foreach (GroupsStudents gs in GroupStudents)
            {
                _context.GroupsStudents.Remove(gs);
            }

            _context.SaveChanges();

            var obrisan =
                _context.GroupsStudents.Where(a => a.StudentId == StudentId && a.Group.DivisionId == DivisionId)
                    .ToList();

            AddToGroup(StudentId, GroupId);

            _context.SaveChanges();
        }

        public bool RemoveFromGroup(int StudentId, int GroupId)
        {
            var query = _context.GroupsStudents.Where(a => a.StudentId == StudentId && a.GroupId == GroupId);
            if (query.Any())
            {
                _context.GroupsStudents.Remove(query.First());
                _context.SaveChanges();
                return true;
            }
            else
                return false;
        }


        public void HideClass(int StudentId, int GroupId)
        {
            GroupsStudents gs = _context.GroupsStudents.First(a => a.StudentId == StudentId && a.GroupId == GroupId);
            if (gs.Ignore == true)
                throw new Exception("vec je u sakriven");

            if (gs.FalseMember == true)
            {
                _context.GroupsStudents.Remove(gs);
            }
            else
            {
                gs.Ignore = true;
            }
            _context.SaveChanges();
        }

        // dodaje u licni raspored
        public void AddClassToPersonalSchedule(int StudentId, int GroupId)
        {
            var query = _context.GroupsStudents.Where(a => a.StudentId == StudentId && a.GroupId == GroupId);


            // unhide
            if (query.Any())
            {
                GroupsStudents gs = _context.GroupsStudents.First(a => a.StudentId == StudentId && a.GroupId == GroupId);
                if (gs.Ignore != true) //null ili false
                    throw new Exception("class_already_in_personal");
                gs.Ignore = false;
            }
            else // dodaj u licni
            {
                GroupsStudents gs = new GroupsStudents
                {
                    StudentId = StudentId,
                    GroupId = GroupId,
                    Ignore = false,
                    Alert = false,
                    FalseMember = true
                };
                _context.GroupsStudents.Add(gs);
            }

            _context.SaveChanges();
        }

        public void AlertClass(int StudentId, int GroupId)
        {
            GroupsStudents gs = _context.GroupsStudents.First(a => a.StudentId == StudentId && a.GroupId == GroupId);
            if (gs.Alert == true)
                throw new Exception("vec je Alertovan");
            gs.Alert = true;
            _context.SaveChanges();

        }

        public void AddActivity(int StudentId, int? GroupId, int? ClassroomId, TimeSpans TimeSpan, string Place,
             string Title, string content)
        {
            _context.TimeSpans.Add(TimeSpan);

            Activities act = new Activities
            {
                GroupId = GroupId,
                TimeSpanId = TimeSpan.TimeSpanId,
                ClassroomId = ClassroomId,
                Place = Place,
                Title = Title,
                ActivityContent = content,
                Cancelling = false,
            };
            _context.Activities.Add(act);

            StudentsActivities sa = new StudentsActivities
            {
                StudentId = StudentId,
                ActivityId = act.ActivityId,
                Ignore = false,
                Alert = false
            };
            _context.StudentsActivities.Add(sa);

            _context.SaveChanges();

        }

        public void DeleteActivity(int StudentId, int ActivityId)
        {
            StudentsActivities sa = _context.StudentsActivities.Include(a => a.Activity).First(a => a.StudentId == StudentId && a.ActivityId == ActivityId);
            Activities ac = sa.Activity;
            _context.Remove(sa);
            _context.Remove(ac);
            _context.SaveChanges();
        }


        public void AlertActivity(int StudentId, int ActivityId)
        {
            StudentsActivities sa = _context.StudentsActivities.First(a => a.StudentId == StudentId && a.ActivityId == ActivityId);
            if (sa.Alert == true)
                throw new Exception("vec je Alertovan");
            sa.Alert = true;
            _context.SaveChanges();
        }

        //vraca oglase koji odgovaraju Studentu iz grupe GroupId(sa kojima bi mogo da se menja)
        public List<BulletinBoardChoiceDTO> GetPossibleBulletinBoardChoices(int GroupId)
        {
            return _context.Periods.Where(a => a.GroupId == GroupId).Select(a => new BulletinBoardChoiceDTO
            {
                AdId = a.AdId,
                Time = TimeSpan.ToString(a.Ad.Group.TimeSpan),
                Classroom = a.Ad.Group.Classroom.Number,
                StudentName = a.Ad.Student.UniMembers.Name + " " + a.Ad.Student.UniMembers.Surname
            }).OrderBy(a => a.Time).ToList();

        }


        //proverava da li su Studenti slobodni u vreme kAda grupa ima cas
        public bool CheckIfStudentsAreAveilable(int GroupId, List<int> Students)
        {

            var groupTs = _context.Groups.First(a => a.GroupId == GroupId).TimeSpan;
            if (groupTs == null)
                return true;

            return this.CheckIfAvailable(groupTs, Students, GroupId);
        }

        public void Update(int GroupId, string name, int? ClassroomId, TimeSpans TimeSpan)
        {

            //provera da li je ucionica slobodna u to vreme, bacice exeption ako nije
            if (ClassroomId != null && TimeSpan != null)
            {
                groupService.CheckIfClassroomIsAvailable(ClassroomId.Value, TimeSpan, GroupId);
            }

            //provera da li su svi Studenti slobodni u to vreme, bacice exeption ako nisu
            var studs = _context.GroupsStudents.Where(a => a.GroupId == GroupId).Select(a => a.StudentId).ToList();
            this.CheckIfAvailable(TimeSpan, studs, GroupId);

            Groups g = _context.Groups.First(a => a.GroupId == GroupId);
            if (name != null)
                g.Name = name;
            if (ClassroomId != null)
                g.ClassroomId = ClassroomId;
            if (TimeSpan != null)
            {
                g.TimeSpan = TimeSpan;
            }

            _context.SaveChanges();


        }

        // groupa GroupId ima novu listu studenata newStudents
        public void ChangeStudents(int GroupId, List<int> newStudents)
        {
            // izbaci sve Studente iz grupe
            RemoveAllStudents(GroupId);
            // ubaci Studente iz liste, njih prethodno izbaci iz svih ostalih grupa raspodele
            MoveStudents(GroupId, newStudents);
        }


        public void RemoveAllStudents(int groupId)
        {
            var gs = _context.GroupsStudents.Where(a => a.GroupId == groupId);
            foreach (GroupsStudents g in gs)
            {
                _context.GroupsStudents.Remove(g);
            }
            _context.SaveChanges();
        }

        // prebacuje studente u grupu
        // brise studente iz ostalih grupa raspodele i ubacuje u tu
        public void MoveStudents(int groupID, List<int> students)
        {
            foreach (int stud in students)
            {
                this.MoveToGroup(stud, groupID);
            }
            _context.SaveChanges();
        }

        //prebaceno je ovde zbog circular dependancy
        public void UpdateGroup(int GroupId, string name, int? ClassroomId, TimeSpans TimeSpan)
        {

            //provera da li je ucionica slobodna u to vreme, bacice exeption ako nije
            if (ClassroomId != null && TimeSpan != null)
            {
                groupService.CheckIfClassroomIsAvailable(ClassroomId.Value, TimeSpan, GroupId);
            }

            //provera da li su svi Studenti slobodni u to vreme, bacice exeption ako nisu
            var studs = _context.GroupsStudents.Where(a => a.GroupId == GroupId).Select(a => a.StudentId).ToList();
            this.CheckIfAvailable(TimeSpan, studs, GroupId);

            Groups g = _context.Groups.First(a => a.GroupId == GroupId);
            if (name != null)
                g.Name = name;
            if (ClassroomId != null)
                g.ClassroomId = ClassroomId;
            if (TimeSpan != null)
            {
                g.TimeSpan = TimeSpan;
            }

            _context.SaveChanges();
        }


        // menja Studenta sa onim koji je postavio oglas koji mu odgovara
        public void ExchangeStudents(int StudentId, int GroupId, int AdId)
        {
            var transaction = _context.Database.BeginTransaction();
            try
            {
                Ads Ad = _context.Ads.First(a => a.AdId == AdId);
                this.MoveToGroup(StudentId, Ad.GroupId);
                this.MoveToGroup(Ad.StudentId, GroupId);
                groupService.RemoveAd(Ad.AdId);
                _context.SaveChanges();
                transaction.Commit();
            }
            catch (InconsistentDivisionException ex)
            {
                transaction.Rollback();
                throw ex;
            }
        }
    }
}
