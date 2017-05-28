using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Courses
    {
        public Courses()
        {
            Activities = new HashSet<Activities>();
            AssistantsCourses = new HashSet<AssistantsCourses>();
            Divisions = new HashSet<Divisions>();
            StudentsCourses = new HashSet<StudentsCourses>();
        }

        public int CourseId { get; set; }
        public string Code { get; set; }
        public string Alias { get; set; }
        public string Name { get; set; }
        public int? DepartmentId { get; set; }
        public int? Semester { get; set; }
        public bool? Obavezni { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<AssistantsCourses> AssistantsCourses { get; set; }
        public virtual ICollection<Divisions> Divisions { get; set; }
        public virtual ICollection<StudentsCourses> StudentsCourses { get; set; }
        public virtual Departments Department { get; set; }
    }
}
