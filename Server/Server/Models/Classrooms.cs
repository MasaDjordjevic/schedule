using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Classrooms
    {
        public Classrooms()
        {
            Activities = new HashSet<Activities>();
            Groups = new HashSet<Groups>();
        }

        public int ClassroomId { get; set; }
        public string Number { get; set; }
        public bool Projector { get; set; }
        public bool SunnySide { get; set; }
        public bool Cs { get; set; }

        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<Groups> Groups { get; set; }
    }
}
