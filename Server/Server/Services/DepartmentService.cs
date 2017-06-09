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
    public class DepartmentService
    {
        private readonly RasporedContext _context;
        private GroupService groupsService;
        private ScheduleService scheduleService;

        public DepartmentService(RasporedContext context, GroupService groupsService, ScheduleService scheduleService)
        {
            _context = context;
            this.groupsService = groupsService;
            this.scheduleService = scheduleService;
        }

        public IEnumerable GetDepartmentsByYear()
        {
            return (from dep in _context.Departments
                    group dep by dep.Year
                    into newDeps
                    orderby newDeps.Key
                    select new { year = newDeps.Key, departments = newDeps }).ToList();
        }

        public string GetDepartmentName(int? deparmentID)
        {
            if (deparmentID == null)
                return null;

            return _context.Departments.Single(a => a.DepartmentId == deparmentID).DepartmentName;
        }

        public IEnumerable GetSchedule(int departmentId, int weeksFromNow = 0)
        {
            DateTime now = DateTime.Now.AddDays(7 * weeksFromNow);
            TimeSpans tsNow = new TimeSpans
            {
                StartDate = now.StartOfWeek(),
                EndDate = now.EndOfWeek()
            };

            List<int> groups = _context.Groups
                .Where(g => g.Division.DepartmentId == departmentId &&
                TimeSpan.DatesOverlap(g.Division.Beginning, g.Division.Ending, tsNow.StartDate, tsNow.EndDate))
                .Select(g => g.GroupId).ToList();

            if (groups.Count == 0)
                return null;


            List<ScheduleDTO> returnValue = _context.Groups.Where(a => groups.Contains(a.GroupId) && TimeSpan.Overlap(a.TimeSpan, tsNow))
                    .Select(a => new ScheduleDTO
                    {
                        Day = a.TimeSpan.StartDate.DayOfWeek,
                        StartMinutes = (int)a.TimeSpan.StartDate.TimeOfDay.TotalMinutes,
                        DurationMinutes = (int)(a.TimeSpan.EndDate.Subtract(a.TimeSpan.StartDate)).TotalMinutes,
                        ClassName = a.Division.Course.Name + " " + a.Name,
                        Abbr = a.Name + " " + a.Division.Course.Alias,
                        Classroom = a.Classroom.Number,
                        Assistant = groupsService.GetAssistant(a.GroupId),
                        Type = a.Division.DivisionType.Type,
                        Active = groupsService.IsActive(a.GroupId, tsNow),
                        Color = scheduleService.GetNextColor(a.Division.Course.Name),
                        IsClass = true,
                        GroupId = a.GroupId
                    }).ToList();

            return scheduleService.Convert(returnValue);

        }
    }
}
