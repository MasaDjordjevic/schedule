using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Students
    {
        public Students()
        {
            Ads = new HashSet<Ads>();
            GroupsStudents = new HashSet<GroupsStudents>();
            StudentsActivities = new HashSet<StudentsActivities>();
            StudentsCourses = new HashSet<StudentsCourses>();
            UniMembers = new HashSet<UniMembers>();
        }

        public int StudentId { get; set; }
        public int DepartmentId { get; set; }
        public int IndexNumber { get; set; }

        public virtual ICollection<Ads> Ads { get; set; }
        public virtual ICollection<GroupsStudents> GroupsStudents { get; set; }
        public virtual ICollection<StudentsActivities> StudentsActivities { get; set; }
        public virtual ICollection<StudentsCourses> StudentsCourses { get; set; }
        public virtual ICollection<UniMembers> UniMembers { get; set; }
        public virtual Departments Department { get; set; }
    }
}
