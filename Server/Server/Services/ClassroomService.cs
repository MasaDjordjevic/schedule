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
    public class ClassroomService
    {
        private readonly RasporedContext _context;
        private GroupService groupsService;
        private ScheduleService scheduleService;

        public ClassroomService(RasporedContext context, GroupService groupsService, ScheduleService scheduleService)
        {
            _context = context;
            this.groupsService = groupsService;
            this.scheduleService = scheduleService;
        }


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
                        Day = ((DateTime)a.TimeSpan.StartDate).DayOfWeek,
                        StartMinutes = (int)((DateTime)a.TimeSpan.StartDate).TimeOfDay.TotalMinutes,
                        DurationMinutes = (int)(((DateTime)a.TimeSpan.EndDate).Subtract(((DateTime)a.TimeSpan.StartDate))).TotalMinutes,
                        ClassName = a.Division.Course.Name + " " + a.Name,
                        Abbr = a.Name + " " + a.Division.Course.Alias,
                        Classroom = a.Classroom.Number,
                        Assistant = groupsService.GetAssistant(a.Assistant),
                        Type = a.Division.DivisionType.Type,
                        Color = groupsService.GetNextColor(a.Division.Course.Name),
                        IsClass = true,
                    }).ToList();

            groupsSchedule.ForEach(a => a.Active = groupsService.IsActive(a.GroupId, tsNow));


            List<ScheduleDTO> activitiesSchedule =
                _context.Activities.Where(a => a.ClassroomId == ClassroomId &&
                    !a.StudentsActivities.Any() && // ne uzima studentove aktivnosti
                    TimeSpan.Overlap(a.TimeSpan, tsNow))
                    .Select(a => new ScheduleDTO
                    {
                        Day = ((DateTime)a.TimeSpan.StartDate).DayOfWeek,
                        StartMinutes = (int)((DateTime)a.TimeSpan.StartDate).TimeOfDay.TotalMinutes,
                        DurationMinutes = (int)(((DateTime)a.TimeSpan.EndDate).Subtract(((DateTime)a.TimeSpan.StartDate))).TotalMinutes,
                        Active = true,
                        Color = groupsService.GetNextColor(a.Title),
                        ActivityTitle = a.Title,
                        ActivityContent = a.ActivityContent,
                        IsClass = false,
                    }).ToList();

            List<ScheduleDTO> returnValue = groupsSchedule.Concat(activitiesSchedule).ToList();


            return scheduleService.Convert(returnValue);
        }

        //GroupId je grupa ciji cas treba zanemariti (grupa koja menja ucionicu
        public bool CheckIfAvailable(int ClassroomId, TimeSpans ts, int? GroupId = null)
        {
            List<TimeSpans> groupsSchedule = _context.Groups
                .Where(a => a.ClassroomId == ClassroomId &&
                            (GroupId == null || a.GroupId != GroupId) && // da ne uzme u obzir trenutni ts grupe, posto se ionako menja
                            TimeSpan.DatesOverlap(a.Division.Beginning, a.Division.Ending, ts.StartDate, ts.EndDate)
                                 && groupsService.IsActive(a.GroupId, ts)) //provera da li raspodela kojoj grupa pripada i dalje vazi_
                    .Select(a => a.TimeSpan).ToList();

            List<TimeSpans> activitiesSchedule =
                _context.Activities.Where(a => a.ClassroomId == ClassroomId &&
                    !groupsService.IsStudentActivity(a.ActivityId))
                    .Select(a => a.TimeSpan).ToList();

            List<TimeSpans> schedule = groupsSchedule.Concat(activitiesSchedule).ToList();

            if (schedule.Any(TimeSpan => Services.TimeSpan.Overlap(TimeSpan, ts)))
            {
                string ClassroomNumber = _context.Classrooms.First(a => a.ClassroomId == ClassroomId).Number;
                throw new InconsistentDivisionException("Ucionica (" + ClassroomNumber + ") nije slobodna u to vreme (" + TimeSpan.ToString(ts) + ").");
            };

            return true;
        }
    }
}

