using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Divisions
    {
        public Divisions()
        {
            Groups = new HashSet<Groups>();
        }

        public int DivisionId { get; set; }
        public int CreatorId { get; set; }
        public int DivisionTypeId { get; set; }
        public DateTime Beginning { get; set; }
        public DateTime Ending { get; set; }
        public int? DepartmentId { get; set; }
        public int? CourseId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Groups> Groups { get; set; }
        public virtual Courses Course { get; set; }
        public virtual UniMembers Creator { get; set; }
        public virtual Departments Department { get; set; }
        public virtual DivisionTypes DivisionType { get; set; }
    }
}
