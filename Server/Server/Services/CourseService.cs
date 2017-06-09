using Microsoft.EntityFrameworkCore;
using Server.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Services
{
    public class CourseService
    {
        private readonly RasporedContext _context;
        private GroupService groupsService;
        private ScheduleService scheduleService;

        public CourseService(RasporedContext context, GroupService groupsService, ScheduleService scheduleService)
        {
            _context = context;
            this.groupsService = groupsService;
            this.scheduleService = scheduleService;
        }

        public void AddAssistantToCourse(int AssistantId, int CourseId, string ClassType)
        {
            AssistantsCourses ass = new AssistantsCourses
            {
                AssistantId = AssistantId,
                CourseId = CourseId,
                ClassType = ClassType
            };

            _context.AssistantsCourses.Add(ass);
            _context.SaveChanges();

        }

        public IEnumerable GetAllCourses()
        {
            return _context.Courses.Include(a => a.Department).ToList();
        }

        public IEnumerable GetCoursesOfDepartment(int DepartmentId)
        {
            return _context.Courses.Include(a => a.Department).Where(a => a.DepartmentId == DepartmentId).ToList();
        }

        public IEnumerable GetCoursesOfDepartmentOfSemester(int DepartmentId, int semester)
        {
            return
                _context.Courses.Include(a => a.Department)
                    .Where(a => a.DepartmentId == DepartmentId && a.Semester == semester)
                    .ToList();
        }


    }
}
