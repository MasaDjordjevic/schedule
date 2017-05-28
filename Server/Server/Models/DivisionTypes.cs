using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class DivisionTypes
    {
        public DivisionTypes()
        {
            Divisions = new HashSet<Divisions>();
        }

        public int DivisionTypeId { get; set; }
        public string Type { get; set; }

        public virtual ICollection<Divisions> Divisions { get; set; }
    }
}
