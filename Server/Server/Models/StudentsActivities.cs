using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class StudentsActivities
    {
        public int StudentActivityId { get; set; }
        public int StudentId { get; set; }
        public int ActivityId { get; set; }
        public bool? Ignore { get; set; }
        public bool? Alert { get; set; }

        public virtual Activities Activity { get; set; }
        public virtual Students Student { get; set; }
    }
}
