using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class ActivitySchedules
    {
        public ActivitySchedules()
        {
            Activities = new HashSet<Activities>();
        }

        public int ActivityScheduleId { get; set; }
        public string Semester { get; set; }
        public DateTime Beginning { get; set; }
        public DateTime Ending { get; set; }
        public string Link { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
    }
}
