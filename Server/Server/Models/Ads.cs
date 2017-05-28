using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Ads
    {
        public Ads()
        {
            Periods = new HashSet<Periods>();
        }

        public int AdId { get; set; }
        public int StudentId { get; set; }
        public int GroupId { get; set; }

        public virtual ICollection<Periods> Periods { get; set; }
        public virtual Groups Group { get; set; }
        public virtual Students Student { get; set; }
    }
}
