using Server.DTOs;
using Server.Extentions;
using Server.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Services
{
    public class AssistantService
    {
        private readonly RasporedContext _context;
        private GroupService groupService;
        private ScheduleService scheduleService;
        private StudentService studentService;

        public AssistantService(RasporedContext context, 
            GroupService groupsService,
            ScheduleService scheduleService,
            StudentService studentService)
        {
            _context = context;
            this.groupService = groupsService;
            this.scheduleService = scheduleService;
            this.studentService = studentService;
        }


        public IEnumerable GetAllAssistants()
        {
            return _context.UniMembers.Where(a => a.StudentId == null).ToList();
        }

        public Object GetAssistant(int assistantID)
        {
            return _context.UniMembers.First(a => a.UniMemberId == assistantID);
        }


        //vraca asistente na osnovu grupe, ako grupa pripada raspodeli koja odgovara kursu onda vraca sve asistente zaduzene za taj kurs, inace vraca sve asistente
        public IEnumerable GetAssistantsByGroupID(int groupID)
        {
            int? courseID = _context.Groups.Where(a => a.GroupId == groupID).Select(a => a.Division.CourseId).First();
            if (courseID == null)
            {
                return _context.UniMembers.Where(a => a.Student == null).ToList();
            }
            else
            {
                return _context.AssistantsCourses.Where(a => a.CourseId == courseID.Value)
                                        .Select(a => a.Assistant)
                                        .ToList();
            }
        }

        public IEnumerable GetSchedule(int assistantID, int weeksFromNow = 0)
        {
            DateTime now = DateTime.Now.AddDays(7 * weeksFromNow);
            TimeSpans tsNow = new TimeSpans
            {
                StartDate = now.StartOfWeek(),
                EndDate = now.EndOfWeek()
            };
            List<int> groups = _context.Groups
                .Where(a => a.AssistantId == assistantID &&
                            TimeSpan.DatesOverlap(a.Division.Beginning, a.Division.Ending, tsNow.StartDate, tsNow.EndDate)) //provera da li raspodela kojoj grupa pripada i dalje vazi
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
                        Assistant = groupService.GetAssistant(a.Assistant),
                        Type = a.Division.DivisionType.Type,
                        Color = groupService.GetNextColor(a.Division.Course.Name),
                        IsClass = true,
                        GroupId = a.GroupId,
                    }).ToList();

            groupsSchedule.ForEach(a => a.Active = groupService.IsActive(a.GroupId, tsNow));
            groupsSchedule.ForEach(a => a.Notifications = groupService.GetNotifications(a.GroupId, tsNow));

            List<ScheduleDTO> activitiesSchedule =
                _context.Activities.Where(a => ((a.AssistantId == assistantID ||
                                                (a.GroupId != null && a.Cancelling == false && groups.Contains(a.GroupId.Value)) ||
                                                (!a.StudentsActivities.Any() && a.GroupId == null))
                                                && TimeSpan.Overlap(a.TimeSpan, tsNow)))
                                                .Select(a => new ScheduleDTO
                                                {
                                                    Day = ((DateTime)a.TimeSpan.StartDate).DayOfWeek,
                                                    StartMinutes = (int)((DateTime)a.TimeSpan.StartDate).TimeOfDay.TotalMinutes,
                                                    DurationMinutes = (int)(((DateTime)a.TimeSpan.EndDate).Subtract(((DateTime)a.TimeSpan.StartDate))).TotalMinutes,
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
            List<ScheduleDTO> returnValue = groupsSchedule.Concat(activitiesSchedule).ToList();


            return scheduleService.Convert(returnValue);
        }

    }
}
