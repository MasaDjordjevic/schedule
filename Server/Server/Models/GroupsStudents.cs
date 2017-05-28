using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class GroupsStudents
    {
        public int GroupsStudentId { get; set; }
        public int GroupId { get; set; }
        public int StudentId { get; set; }
        public bool? Ignore { get; set; }
        public bool? Alert { get; set; }
        public bool? FalseMember { get; set; }

        public virtual Groups Group { get; set; }
        public virtual Students Student { get; set; }
    }
}
