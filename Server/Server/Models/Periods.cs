using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Periods
    {
        public int PeriodId { get; set; }
        public int AdId { get; set; }
        public int GroupId { get; set; }

        public virtual Ads Ad { get; set; }
        public virtual Groups Group { get; set; }
    }
}
