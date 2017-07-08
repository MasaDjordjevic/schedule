using Microsoft.EntityFrameworkCore;
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
    public class GroupService
    {
        private readonly RasporedContext _context;
        private ScheduleService scheduleService;
        public GroupService(RasporedContext context, ScheduleService scheduleService)
        {
            _context = context;
            this.scheduleService = scheduleService;
        }
        public IEnumerable GetAllGroups()
        {
            return _context.Groups
                .Include(a => a.Classroom)
                .Include(a => a.TimeSpan)
                .ToList();
        }

        public Groups GetGroup(int groupId)
        {
            Groups pom = _context.Groups
                .Include(a => a.Classroom)
                .Include(a => a.TimeSpan)
                .Include(a => a.GroupsStudents).ThenInclude(aa => aa.Student).ThenInclude(aa => aa.UniMembers)
                .Include(a => a.Assistant)
                .First(a => a.GroupId == groupId);

            pom.Division = _context.Divisions.First(a => a.DivisionId == pom.DivisionId);
            return pom;
        }

        public void RemoveGroup(int groupId)
        {
            // brisanje TimeSpana
            Groups group = _context.Groups.Include(a => a.TimeSpan).First(a => a.GroupId == groupId);
            TimeSpans ts = group.TimeSpan;
            // brisanje same grupe
            _context.Groups.Remove(@group);
            _context.SaveChanges();
            if (ts != null)
            {
                _context.TimeSpans.Remove(ts);
            }
            _context.SaveChanges();
        }

        public IEnumerable GetGroupsOfDivision(int divisionId)
        {
            return _context.Groups
                .Include(a => a.Classroom)
                .Include(a => a.TimeSpan)
                .Where(a => a.DivisionId == divisionId)
                .ToList();
        }

        public void CancelClass(int groupId, string title, string content, TimeSpans timeSpan)
        {
            if (!IsActive(groupId, timeSpan))
                throw new Exception("Čas je već otkazan.");

            _context.TimeSpans.Add(timeSpan);
            Activities act = new Activities
            {
                Title = title,
                ActivityContent = content,
                GroupId = groupId,
                Cancelling = true,
                TimeSpanId = timeSpan.TimeSpanId
            };
            _context.Activities.Add(act);
            _context.SaveChanges();

        }

        public IEnumerable GetCanceledTimes(int groupId)
        {
            var times = _context.Activities.Where(ac =>
               !IsStudentActivity(ac.ActivityId) && // nece ako se ovde direktno ispita
               ac.GroupId == groupId && ac.Cancelling == true)
               .Select(a => new
               {
                   ActivityId = a.ActivityId,
                   time = TimeSpan.ToString(a.TimeSpan)
               }).ToList();
            return times;
        }

        public void DeleteActivity(int activityId)
        {
            // brisanje TimeSpana
            Activities act = _context.Activities.Include(a => a.TimeSpan).First(a => a.ActivityId == activityId);
            TimeSpans ts = act.TimeSpan;
            // brisanje same grupe
            _context.Activities.Remove(act);
            _context.SaveChanges();
            if (ts != null)
            {
                _context.TimeSpans.Remove(ts);
            }
            _context.SaveChanges();
        }




        //public bool AddStudnets(int GroupId, List<int> Students)
        //{
        //    //proverava da li su neki vec clanovi te grupe
        //    CheckIfMembers(GroupId, Students);

        //    //provera konzistentnost sa ostalim grupama
        //    CheckConsistencyWithOtherGroups(GroupId, Students);

        //    //proverava da li su Studenti slobodni u vreme kAda grupa ima cas
        //    CheckIfStudentsAreAveilable(GroupId, Students);


        //    foreach (int studID in Students)
        //    {
        //        GroupsStudents gs = new GroupsStudents
        //        {
        //            GroupId = GroupId,
        //            StudentId = studID
        //        };
        //        _context.GroupsStudents.Add(gs);
        //    }
        //    _context.SaveChanges();
        //    return true;
        //}




        //proverava da li je neko od studenata iz Students vec clan grupe GroupId
        public bool CheckIfMembers(int groupId, List<int> students)
        {
            var alreAdyInGroup = _context.GroupsStudents
                .Where(a => a.GroupId == groupId && students.Contains(a.StudentId))
                .Select(a => a.Student.UniMembers.Name + " " + a.Student.UniMembers.Surname).ToList();
            if (alreAdyInGroup.Any())
            {
                string exp = alreAdyInGroup.Count() > 1
                    ? "Studenti su vec clanovi grupe.\n"
                    : "Student je vec clan grupe.\n";
                exp += String.Join("\n", alreAdyInGroup);
                throw new InconsistentDivisionException(exp);
            }

            return true;
        }

        //proverava da li svi Studenti te grupe nisu clanovi neke druge grupe te raspodele
        //GroupId moze da bude null u slucaju provere prilikom kreiranja nove grupe
        public bool CheckConsistencyWithOtherGroups(int? groupId, List<int> students)
        {
            //proverava Studente u ostalim grupama raspodele
            var groups =
                _context.Groups.Where(
                    a => (groupId == null || a.GroupId != groupId) && //bez te konkrentne grupe
                    a.DivisionId == _context.Groups.First(g => g.GroupId == groupId).DivisionId) //sve grupe raspodele kojo ta grupa pripAda
                    .Select(a => a.GroupId).ToList();

            //Studenti koji pripAdaju tim grupama, kao i grupe
            var StudentsGroups = _context.GroupsStudents.Where(a => groups.Contains(a.GroupId)).Select(a => new { Student = a.StudentId, grupa = a.Group.Name }).ToList();
            var studs = StudentsGroups.Select(a => a.Student);
            //proverava da li za svakog Studenta vazi da nije u studs odnosno ne pripAda ni jednoj drugoj grupi
            if (students.Any(stud => studs.Contains(stud)))
            {
                var inconsistants = _context.Students
                    .Where(stud => students.Contains(stud.StudentId) && studs.Contains(stud.StudentId))
                    .Select(a => a.UniMembers.Name + " " + a.UniMembers.Surname + " pripAda grupi " + StudentsGroups.First(sg => sg.Student == a.StudentId).grupa)
                    .ToList();
                string exp = inconsistants.Count() > 1 ? "Studenti pripAdaju drugim grupama raspodele. " : "Student pripAda drugoj grupi raspodele. ";
                exp += String.Join("\n", inconsistants);
                throw new InconsistentDivisionException(exp);
            }
            else
            {
                return true;
            }
        }

        public void RemoveStudents(int groupId, List<int> students)
        {
            foreach (int studID in students)
            {
                var gs =
                    (from a in _context.GroupsStudents
                     where a.StudentId == studID && a.GroupId == groupId
                     select a).First();
                _context.GroupsStudents.Remove(gs);
            }
            _context.SaveChanges();
        }



        public Groups Create(int DivisionId, string name, int? ClassroomId, TimeSpans timeSpan)
        {


            //provera da li je ucionica slobodna u to vreme
            if (ClassroomId != null)
            {
                this.CheckIfClassroomIsAvailable(ClassroomId.Value, timeSpan);
            }

            if (timeSpan != null)
            {
                _context.TimeSpans.Add(timeSpan);
            }
            _context.SaveChanges();
            Groups g = new Groups
            {
                DivisionId = DivisionId,
                Name = name,
                ClassroomId = ClassroomId,

            };
            if (timeSpan != null)
            {
                g.TimeSpanId = timeSpan.TimeSpanId;
            }
            _context.Groups.Add(g);
            _context.SaveChanges();

            return g;

        }

        public void AddActivity(int assistantId, int? groupId, int? classroomId, TimeSpans timeSpan, string place,
            string title, string content)
        {
            _context.TimeSpans.Add(timeSpan);

            Activities act = new Activities
            {
                TimeSpanId = timeSpan.TimeSpanId,
                ClassroomId = classroomId,
                Place = place,
                Title = title,
                ActivityContent = content,
                GroupId = groupId,
                Cancelling = false,
                AssistantId = assistantId,
            };
            _context.Activities.Add(act);
            _context.SaveChanges();
        }

        // vraca vreme kAda grupa ima cas u naredne 4 nedelje
        public IEnumerable GetActivityTimes(int groupId)
        {
            TimeSpans groupTs = _context.Groups.Where(a => a.GroupId == groupId).Select(a => a.TimeSpan).First();
            if (groupTs == null)
                return null;
            int period = groupTs.Period ?? 1;
            List<TimeSpans> returnValue = new List<TimeSpans>();
            for (int i = 0; i < 4; i++)
            {
                TimeSpans ts = new TimeSpans
                {
                    StartDate = groupTs.StartDate.DayOfReferencedWeek(DateTime.Now.AddDays(7 * i), period),
                    EndDate = groupTs.EndDate.DayOfReferencedWeek(DateTime.Now.AddDays(7 * i), period)
                };
                returnValue.Add(ts);
            }

            return returnValue;
        }

        public void SetAsstant(int groupId, int assistantId)
        {

            var group = _context.Groups.First(a => a.GroupId == groupId);
            group.AssistantId = assistantId;

            // ako asistent nije bio zAduzen za kurs dodati ga

            int? CourseId = _context.Groups.Where(a => a.GroupId == groupId).Select(a => a.Division.CourseId).First();
            if (CourseId != null && !_context.AssistantsCourses.Any(a => a.AssistantId == assistantId && a.CourseId == CourseId.Value))
            {
                AssistantsCourses asscour = new AssistantsCourses
                {
                    AssistantId = assistantId,
                    CourseId = CourseId.Value
                };
                _context.AssistantsCourses.Add(asscour);
            }

            _context.SaveChanges();
        }

        public AssistantNameMailDTO GetAssistant(int GroupId)
        {

            var query = _context.Groups.Where(a => a.GroupId == GroupId)
                    .Select(a => new AssistantNameMailDTO
                    {
                        Name = a.Assistant.Name + " " + a.Assistant.Surname,
                        Mail = a.Assistant.Email
                    }).ToList();
            if (query.Any())
                return query.First();
            else
                return null;
        }

        public AssistantNameMailDTO GetAssistant(UniMembers asst)
        {
            if (asst == null)
                return null;
            return new AssistantNameMailDTO
            {
                Name = asst.Name + " " + asst.Surname,
                Mail = asst.Email
            };
        }

        // vraca termine ostalih grupa raspodele
        public List<BulletinBoardChoiceDTO> GetAllBulletinBoardChoices(int groupId, int? studentId = null)
        {
            return _context.Groups.Where(a => a.GroupId != groupId &&
                                            a.DivisionId == _context.Groups.First(g => g.GroupId == groupId).DivisionId)
                                            .Select(a => new BulletinBoardChoiceDTO
                                            {
                                                GroupId = a.GroupId,
                                                Time = TimeSpan.ToString(a.TimeSpan),
                                                Classroom = a.Classroom.Number,
                                                Chosen = studentId != null && IsChosen(a.GroupId, studentId)
                                            }).OrderBy(a => a.Time).ToList();
        }

        public bool IsChosen(int GroupId, int? StudentId)
        {
            if (StudentId == null) return false;
            return _context.Periods.Any(a => a.GroupId == GroupId && a.Ad.StudentId == StudentId);
        }






        public void RemoveAd(int AdId)
        {
            var Ad = _context.Ads.Include(a => a.Periods).First(a => a.AdId == AdId);
            foreach (var period in Ad.Periods)
            {
                _context.Remove(period);
            }
            _context.SaveChanges();
            _context.Ads.Remove(Ad);
            _context.SaveChanges();
        }

        // Student iz grupe GroupId dodaje oglas i odgovaraju mu termini grupa iz liste
        // dodaje oglas ukoliko ne postoji,  menja ukoliko postoji, brise ukoliko postoji a nista nije selektirano
        public void AddEditAd(int StudentId, int GroupId, List<int> GroupIds)
        {
            var query = _context.Ads.Include(a => a.Periods).Where(a => a.StudentId == StudentId && a.GroupId == GroupId);
            Ads Ad;

            if (GroupIds == null || GroupIds.Count == 0)
            {
                if (query.Any())
                {
                    RemoveAd(query.First().AdId);
                }
                return;
            }

            if (query.Any())
            {
                Ad = query.First();
                foreach (var period in Ad.Periods)
                {
                    _context.Remove(period);
                }
            }
            else
            {
                Ad = new Ads
                {
                    StudentId = StudentId,
                    GroupId = GroupId
                };
                _context.Ads.Add(Ad);
            }

            foreach (int g in GroupIds)
            {
                Periods p = new Periods
                {
                    AdId = Ad.AdId,
                    GroupId = g
                };
                _context.Periods.Add(p);
            }
            _context.SaveChanges();
        }


        public bool IsActive(int GroupId, TimeSpans tsNow)
        {
            bool canceled = _context.Activities.Any(ac =>
               !ac.StudentsActivities.Any() && // nece ako se ovde direktno ispita
               ac.GroupId == GroupId && ac.Cancelling == true &&
               TimeSpan.TimeSpanOverlap(ac.TimeSpan, tsNow));
            return !canceled;
        }

        // nece ako se stavi u linq izraz
        public bool IsStudentActivity(int ActivityId)
        {
            return _context.StudentsActivities.Any(sa => sa.ActivityId == ActivityId);
        }

        public List<NotificationDTO> GetNotifications(int GroupId, TimeSpans ts)
        {
            List<NotificationDTO> groupsNotifications = _context.Activities.Where(ac =>
                 !ac.StudentsActivities.Any() && // nece ako se ovde direktno ispita
                 ac.GroupId == GroupId &&
                 TimeSpan.TimeSpanOverlap(ac.TimeSpan, ts))
                 .Select(ac => new NotificationDTO
                 {
                     ActivityId = ac.ActivityId,
                     ActivityContent = ac.ActivityContent,
                     Title = ac.Title,
                     ClassroomId = ac.ClassroomId,
                     Place = ac.Place
                 }).ToList();

            return groupsNotifications;
        }

        public IEnumerable GetCombinedSchedule(int GroupId, int weeksFromNow = 0)
        {
            DateTime now = DateTime.Now.AddDays(7 * weeksFromNow);
            TimeSpans tsNow = new TimeSpans
            {
                StartDate = now.StartOfWeek(),
                EndDate = now.EndOfWeek()
            };
            List<int> Students = _context.GroupsStudents.Where(a => a.GroupId == GroupId).Select(a => a.StudentId).ToList();
            List<int> groups = _context.GroupsStudents
                .Where(a => Students.Contains(a.StudentId) &&
                            TimeSpan.DatesOverlap(a.Group.Division.Beginning, a.Group.Division.Ending, tsNow.StartDate, tsNow.EndDate)) //provera da li raspodela kojoj grupa pripAda i dalje vazi
                            .Select(a => a.GroupId).ToList();

            List<ScheduleDTO> groupsSchedule = _context.Groups.Where(a => groups.Contains(a.GroupId) && TimeSpan.Overlap(a.TimeSpan, tsNow))
                .Select(a => new ScheduleDTO
                {
                    Day = ((DateTime)a.TimeSpan.StartDate).DayOfWeek,
                    StartMinutes = (int)((DateTime)a.TimeSpan.StartDate).TimeOfDay.TotalMinutes,
                    DurationMinutes = (int)(((DateTime)a.TimeSpan.EndDate).Subtract(((DateTime)a.TimeSpan.StartDate))).TotalMinutes,
                    ClassName = a.Division.Course.Name,
                    Abbr = a.Division.Course.Alias,
                    Classroom = a.Classroom.Number,
                    Assistant = GetAssistant(a.Assistant),
                    Type = a.Division.DivisionType.Type,
                    Color = this.GetNextColor(a.Division.Course.Name),
                    IsClass = true,
                }).ToList();

            groupsSchedule.ForEach(a => a.Active = IsActive(a.GroupId, tsNow));


            List<ScheduleDTO> activitiesSchedule =
                _context.Activities.Where(a => a.Cancelling != true && a.GroupId != null && groups.Contains(a.GroupId.Value) && !a.StudentsActivities.Any()
                                                && TimeSpan.Overlap(a.TimeSpan, tsNow))
                .Select(a => new ScheduleDTO
                {
                    Day = ((DateTime)a.TimeSpan.StartDate).DayOfWeek,
                    StartMinutes = (int)((DateTime)a.TimeSpan.StartDate).TimeOfDay.TotalMinutes,
                    DurationMinutes = (int)(((DateTime)a.TimeSpan.EndDate).Subtract(((DateTime)a.TimeSpan.StartDate))).TotalMinutes,
                    Active = true,
                    Color = this.GetNextColor(a.Title),
                    ActivityTitle = a.Title,
                    ActivityContent = a.ActivityContent,
                    IsClass = false,
                }).ToList();

            List<ScheduleDTO> returnValue = groupsSchedule.Concat(activitiesSchedule).ToList();


            return scheduleService.Convert(returnValue);
        }

        private static int colorCounter = -1;

        public string GetNextColor(string name)
        {
            string[] boje = new string[] {
                "MaterialRed",
                "MaterialPurple",
                "MaterialPink",
                "MaterialDeep-purple",
                "MaterialLight-green",
                "MaterialOrange",
                "MaterialBlue",
                "MaterialLight-blue",
                "MaterialLime",
                "MaterialGreen",
                "MaterialTeal",
                "MaterialBrown"
            };

            colorCounter++;
            if (colorCounter == boje.Length)
                colorCounter = 0;
            int num = 7;
            foreach (char c in name)
            {
                /*num = num*11 + Math.Abs(
                    (c+1) * (c-1) +
                    (int)Math.Round( (double) ( (double)c / 17.00) )
                );*/
                num = (num * 33) + c * 12;
            }
            num *= num;
            num = Math.Abs(num);
            num = (num % 101) % boje.Length;

            if (name.StartsWith("Mik"))
            {
                num = 0;
            }

            return boje[num];

        }


        //classroom Service

        public IEnumerable GetClassrooms()
        {
            return (from a in _context.Classrooms select a).OrderBy(a => a.Number).ToList();
        }

        public IEnumerable GetSchedule(int ClassroomId, int weeksFromNow = 0)
        {
            DateTime now = DateTime.Now.AddDays(7 * weeksFromNow);
            TimeSpans tsNow = new TimeSpans
            {
                StartDate = now.StartOfWeek(),
                EndDate = now.EndOfWeek()
            };

            List<int> groups = _context.Groups
                .Where(a => a.ClassroomId == ClassroomId &&
                            TimeSpan.DatesOverlap(a.Division.Beginning, a.Division.Ending, tsNow.StartDate,
                                tsNow.EndDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
                .Select(a => a.GroupId).ToList();

            List<ScheduleDTO> groupsSchedule =
                _context.Groups.Where(a => groups.Contains(a.GroupId) && TimeSpan.Overlap(a.TimeSpan, tsNow))
                    .Select(a => new ScheduleDTO
                    {
                        Day = a.TimeSpan.StartDate.DayOfWeek,
                        StartMinutes = (int)a.TimeSpan.StartDate.TimeOfDay.TotalMinutes,
                        DurationMinutes = (int)(a.TimeSpan.EndDate.Subtract(a.TimeSpan.StartDate)).TotalMinutes,
                        ClassName = a.Division.Course.Name + " " + a.Name,
                        Abbr = a.Name + " " + a.Division.Course.Alias,
                        Classroom = a.Classroom.Number,
                        Assistant = this.GetAssistant(a.GroupId),
                        Type = a.Division.DivisionType.Type,
                        Active = this.IsActive(a.GroupId, tsNow),
                        Color = this.GetNextColor(a.Division.Course.Name),
                        IsClass = true,
                    }).ToList();

            List<ScheduleDTO> activitiesSchedule =
                _context.Activities.Where(a => a.ClassroomId == ClassroomId &&
                    !this.IsStudentActivity(a.ActivityId) && // ne uzima studentove aktivnosti
                    TimeSpan.Overlap(a.TimeSpan, tsNow))
                    .Select(a => new ScheduleDTO
                    {
                        Day = a.TimeSpan.StartDate.DayOfWeek,
                        StartMinutes = (int)a.TimeSpan.StartDate.TimeOfDay.TotalMinutes,
                        DurationMinutes = (int)(a.TimeSpan.EndDate.Subtract(a.TimeSpan.StartDate)).TotalMinutes,
                        Active = true,
                        Color = this.GetNextColor(a.Title),
                        ActivityTitle = a.Title,
                        ActivityContent = a.ActivityContent,
                        IsClass = false,
                    }).ToList();

            List<ScheduleDTO> returnValue = groupsSchedule.Concat(activitiesSchedule).ToList();


            return scheduleService.Convert(returnValue);
        }

        //GroupId je grupa ciji cas treba zanemariti (grupa koja menja ucionicu)
        public bool CheckIfClassroomIsAvailable(int ClassroomId, TimeSpans ts, int? GroupId = null)
        {
            var pom = _context.Groups
               .Where(a => a.ClassroomId == ClassroomId &&
                           (GroupId == null || a.GroupId != GroupId) && // da ne uzme u obzir trenutni ts grupe, posto se ionako menja
                           (ts == null || TimeSpan.DatesOverlap(a.Division.Beginning, a.Division.Ending, ts.StartDate, ts.EndDate))) //provera da li raspodela kojoj grupa pripada i dalje vazi
                           .ToList();
            // mora iz dva dela
            List<TimeSpans> groupsSchedule = pom.Where(a => a.TimeSpan != null && this.IsActive(a.GroupId, ts)).Select(a => a.TimeSpan).ToList();


            List<TimeSpans> activitiesSchedule =
                _context.Activities.Where(a => a.ClassroomId == ClassroomId &&
                    !this.IsStudentActivity(a.ActivityId))
                    .Select(a => a.TimeSpan).ToList();

            List<TimeSpans> schedule = groupsSchedule.Concat(activitiesSchedule).ToList();

            if (schedule.Any(timespan => Services.TimeSpan.Overlap(timespan, ts)))
            {
                string ClassroomNumber = _context.Classrooms.First(a => a.ClassroomId == ClassroomId).Number;
                throw new InconsistentDivisionException("Ucionica (" + ClassroomNumber + ") nije slobodna u to vreme (" + TimeSpan.ToString(ts) + ").");
            };

            return true;
        }
    }

}
