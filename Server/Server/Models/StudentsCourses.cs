using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class StudentsCourses
    {
        public int StudentsCourseId { get; set; }
        public int StudentId { get; set; }
        public int CourseId { get; set; }

        public virtual Courses Course { get; set; }
        public virtual Students Student { get; set; }
    }
}
