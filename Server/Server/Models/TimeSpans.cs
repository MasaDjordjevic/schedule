using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class TimeSpans
    {
        public TimeSpans()
        {
            Activities = new HashSet<Activities>();
            Groups = new HashSet<Groups>();
        }

        public int TimeSpanId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? Period { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<Groups> Groups { get; set; }
    }
}
