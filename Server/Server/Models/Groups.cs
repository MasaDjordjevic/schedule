using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Groups
    {
        public Groups()
        {
            Activities = new HashSet<Activities>();
            Ads = new HashSet<Ads>();
            GroupsStudents = new HashSet<GroupsStudents>();
            Periods = new HashSet<Periods>();
        }

        public int GroupId { get; set; }
        public int? ClassroomId { get; set; }
        public int DivisionId { get; set; }
        public int? TimeSpanId { get; set; }
        public string Name { get; set; }
        public int? AssistantId { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<Ads> Ads { get; set; }
        public virtual ICollection<GroupsStudents> GroupsStudents { get; set; }
        public virtual ICollection<Periods> Periods { get; set; }
        public virtual UniMembers Assistant { get; set; }
        public virtual Classrooms Classroom { get; set; }
        public virtual Divisions Division { get; set; }
        public virtual TimeSpans TimeSpan { get; set; }
    }
}
