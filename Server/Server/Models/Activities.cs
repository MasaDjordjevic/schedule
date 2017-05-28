using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Activities
    {
        public Activities()
        {
            StudentsActivities = new HashSet<StudentsActivities>();
        }

        public int ActivityId { get; set; }
        public int TimeSpanId { get; set; }
        public string Place { get; set; }
        public int? ClassroomId { get; set; }
        public string Title { get; set; }
        public string ActivityContent { get; set; }
        public int? GroupId { get; set; }
        public int? ActivityScheduleId { get; set; }
        public bool? Cancelling { get; set; }
        public int? CourseId { get; set; }
        public int? AssistantId { get; set; }

        public virtual ICollection<StudentsActivities> StudentsActivities { get; set; }
        public virtual ActivitySchedules ActivitySchedule { get; set; }
        public virtual UniMembers Assistant { get; set; }
        public virtual Classrooms Classroom { get; set; }
        public virtual Courses Course { get; set; }
        public virtual Groups Group { get; set; }
        public virtual TimeSpans TimeSpan { get; set; }
    }
}
