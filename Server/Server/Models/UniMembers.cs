using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class UniMembers
    {
        public UniMembers()
        {
            Activities = new HashSet<Activities>();
            AssistantsCourses = new HashSet<AssistantsCourses>();
            Divisions = new HashSet<Divisions>();
            Groups = new HashSet<Groups>();
            UniMembersRoles = new HashSet<UniMembersRoles>();
        }

        public int UniMemberId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Address { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public int? StudentId { get; set; }
        public byte[] Avatar { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<AssistantsCourses> AssistantsCourses { get; set; }
        public virtual ICollection<Divisions> Divisions { get; set; }
        public virtual ICollection<Groups> Groups { get; set; }
        public virtual ICollection<UniMembersRoles> UniMembersRoles { get; set; }
        public virtual Students Student { get; set; }
    }
}
