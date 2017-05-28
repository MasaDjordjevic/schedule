using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Departments
    {
        public Departments()
        {
            Courses = new HashSet<Courses>();
            Divisions = new HashSet<Divisions>();
            Students = new HashSet<Students>();
        }

        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int Year { get; set; }

        public virtual ICollection<Courses> Courses { get; set; }
        public virtual ICollection<Divisions> Divisions { get; set; }
        public virtual ICollection<Students> Students { get; set; }
    }
}
