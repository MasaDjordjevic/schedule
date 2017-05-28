using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class AssistantsCourses
    {
        public int AssistantCourseId { get; set; }
        public int AssistantId { get; set; }
        public int CourseId { get; set; }
        public string ClassType { get; set; }

        public virtual UniMembers Assistant { get; set; }
        public virtual Courses Course { get; set; }
    }
}
