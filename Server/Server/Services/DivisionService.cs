using Microsoft.EntityFrameworkCore;
using Server.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Services
{
    public class DivisionService
    {
        private readonly RasporedContext _context;
        private GroupService groupsService;
        private StudentService studentService;
        public DivisionService(RasporedContext context, GroupService groupsService, StudentService studentService)
        {
            _context = context;
            this.groupsService = groupsService;
            this.studentService = studentService;
        }

        public List<Divisions> GetDivisionsOfDepartment(int DepartmentId)
        {
            return (from div in _context.Divisions
                .Include(p => p.Creator)
                .Include(p => p.DivisionType)
                .Include(p => p.Department)
                .Include(p => p.Course)
                    where div.DepartmentId == DepartmentId
                    select div
                    ).ToList();
        }

        public Object GetDivison(int DivisionId)
        {
            var pom = (from a in _context.Divisions
                           .Include(p => p.Creator)
                           .Include(p => p.DivisionType)
                           .Include(p => p.Department)
                           .Include(p => p.Course)
                           .Include(p => p.Groups)
                           //.ThenInclude(a => a.GroupsStudents)//.ThenInclude(a=>a.Student).ThenInclude(a=>a.UniMembers)
                           .Include(p => p.Groups).ThenInclude(a => a.Classroom)
                           .Include(p => p.Groups).ThenInclude(a => a.TimeSpan)
                       where a.DivisionId == DivisionId
                       select a).First();

                        

            var q = pom.Creator;

            // morala sam iz dva koraka i sa selectom da ne bi izvuko previse informacija, inace ulazi u petlju...
            foreach (var g in pom.Groups)
            {
                g.GroupsStudents = (from a in _context.GroupsStudents
                                    where a.GroupId == g.GroupId
                                    select new GroupsStudents
                                    {
                                        StudentId = a.StudentId,
                                        Student = _context.Students.Where(m => m.StudentId == a.StudentId).Select(m => new Students
                                        {
                                            StudentId = m.StudentId,
                                            DepartmentId = m.DepartmentId,
                                            IndexNumber = m.IndexNumber,
                                            UniMembers = (from d in _context.UniMembers where d.StudentId == m.StudentId select d).First()
                                        }).First()
                                    }).ToList();
            }

            return pom;
        }

        public IEnumerable GetDivisionsOfDeparmentByType(int DepartmentId)
        {
            List<Divisions> allDivisions = this.GetDivisionsOfDepartment(DepartmentId);

            var Divisions = (from div in allDivisions
                             select new
                             {
                                 DivisionId = div.DivisionId,
                                 CreatorId = div.CreatorId,
                                 CreatorName = div.Creator.Name,
                                 DivisionTypeId = div.DivisionTypeId,
                                 DivisionTypeName = div.DivisionType.Type,
                                 Beginning = div.Beginning,
                                 Ending = div.Ending,
                                 DepartmentId = div.DepartmentId,
                                 DepartmentName = div.Department.DepartmentName,
                                 Course = div.Course?.Name,
                                 Name = div.Name
                             }).ToList();

            var pom  = (from div in Divisions
                    group div by div.DivisionTypeName
                        into newDivs
                    orderby newDivs.Key
                    select new { Type = newDivs.Key, Divisions = newDivs }).ToList();

            return pom;
        }

        public List<StudentDTO> GetStudentsOfCourse(int CourseId, int sortOrder)
        {
            List<Students> Students = studentService.GetStudentsOfCourse(CourseId);
            if (sortOrder == 0) //po indexu
                Students = Students.OrderBy(a => a.IndexNumber).ToList();
            if (sortOrder == 1) //random
                Students = Students.OrderBy(a => Guid.NewGuid()).ToList();

            return (from s in Students
                    select new StudentDTO()
                    {
                        StudentId = s.StudentId,
                        IndexNumber = s.IndexNumber,
                        Name = s.UniMembers.Name,
                        Surname = s.UniMembers.Surname
                    }).ToList();
        }

        public IEnumerable DivideOnX(int CourseId, int x, int sortOrder)
        {
            List<StudentDTO> studs = GetStudentsOfCourse(CourseId, sortOrder);
            int studsInGroupLower = studs.Count / x;
            int numGroupsHeigher = studs.Count % x;

            List<List<StudentDTO>> groups = new List<List<StudentDTO>>();
            int total = 0;
            for (int i = 0; i < x; i++)
            {
                var num = studsInGroupLower;
                if (numGroupsHeigher-- > 0)
                    num++;

                groups.Add(studs.Skip(total).Take(num).ToList());
                total += num;
            }

            return groups;
        }

        //radi isto kao i DevideOnX samo sto on radi po modulu pa ih ima x ova radi deljenje pa ih ima po x
        public IEnumerable DivideWithX(int CourseId, int x, int sortOrder)
        {
            List<StudentDTO> studs = GetStudentsOfCourse(CourseId, sortOrder);
            int ceil = (int)Math.Ceiling((double)studs.Count / x);

            while ((int)Math.Ceiling((double)studs.Count / x) == ceil)
            {
                x--;
            }

            int studsInGroupLower = x;
            int numGroupsHeigher = studs.Count % x;

            List<List<StudentDTO>> groups = new List<List<StudentDTO>>();
            int total = 0;
            for (int i = 0; total < studs.Count; i++)
            {
                var num = studsInGroupLower;
                if (numGroupsHeigher-- > 0)
                    num++;

                groups.Add(studs.Skip(total).Take(num).ToList());
                total += num;
            }

            return groups;
        }


        public class GroupOfStudents
        {
            public string Name;
            public List<Students> Students;
        }

        public void CreateInitialDivision(int CreatorId, string Name, int DepartmentId, int CourseId, int DivisionTypeId, DateTime Beginning, DateTime Ending,
            List<DivisionService.GroupOfStudents> groups)
        {

            Divisions div = new Divisions
            {
                Name = Name,
                CreatorId = CreatorId,
                DivisionTypeId = DivisionTypeId,
                Beginning = Beginning,
                Ending = Ending,
                DepartmentId = DepartmentId,
                CourseId = CourseId
            };

            _context.Divisions.Add(div);
            _context.SaveChanges();

            foreach (GroupOfStudents group in groups)
            {
                Groups g = new Groups
                {
                    ClassroomId = null,
                    DivisionId = div.DivisionId,
                    TimeSpanId = null,
                    Name = group.Name,
                };

                _context.Groups.Add(g);
                _context.SaveChanges();

                foreach (Students stud in group.Students)
                {
                    GroupsStudents gs = new GroupsStudents
                    {
                        GroupId = g.GroupId,
                        StudentId = stud.StudentId
                    };
                    _context.GroupsStudents.Add(gs);
                }

                _context.SaveChanges();
            }

        }


        public void UpdateDivision(int DivisionId, string Name, DateTime? Beginning, DateTime? Ending, int? DivisionTypeId, int? CourseId)
        {
            Divisions div = _context.Divisions.First(a => a.DivisionId == DivisionId);
            if (Beginning != null)
            {
                div.Beginning = Beginning.Value;
            }
            if (Name != null)
            {
                div.Name = Name;
            }
            if (Ending != null)
            {
                div.Ending = Ending.Value;
            }
            if (DivisionTypeId != null)
            {
                div.DivisionTypeId = DivisionTypeId.Value;
            }
            if (CourseId != null)
            {
                div.CourseId = CourseId.Value;
            }
            _context.SaveChanges();

        }

        public Divisions CopyDivision(int AssistantID, int DivisionId)
        {
            Divisions Division = _context.Divisions.Include(a => a.Groups).ThenInclude(a => a.GroupsStudents).First(a => a.DivisionId == DivisionId);
            // ovo radim jer nece da ignorise setovane IDjeve pa ih ovako unsetujem
            Divisions newDiv = new Divisions
            {
                CourseId = Division.CourseId,
                Beginning = Division.Beginning,
                Ending = Division.Ending,
                CreatorId = AssistantID,
                DivisionTypeId = Division.DivisionTypeId,
                DepartmentId = Division.DepartmentId,
                Name = Division.Name + " (kopija)",
            };

            _context.Divisions.Add(newDiv);

            _context.SaveChanges();

            foreach (Groups g in Division.Groups)
            {
                Groups newG = new Groups
                {
                    ClassroomId = g.ClassroomId,
                    DivisionId = newDiv.DivisionId,
                    TimeSpan = g.TimeSpan,
                    Name = g.Name,
                };

                _context.Groups.Add(newG);
                _context.SaveChanges();

                foreach (GroupsStudents a in g.GroupsStudents)
                {
                    GroupsStudents newGS = new GroupsStudents
                    {
                        GroupId = newG.GroupId,
                        StudentId = a.StudentId
                    };
                    _context.GroupsStudents.Add(newGS);
                }

            };

            _context.SaveChanges();

            return newDiv;

        }

        public void DeleteDivision(int DivisionId)
        {
            Divisions Division = _context.Divisions.Include(a => a.Groups).First(a => a.DivisionId == DivisionId);

            foreach (Groups g in Division.Groups)
            {
                _context.Groups.Remove(g);
            }

            _context.Divisions.Remove(Division);

            _context.SaveChanges();

        }

        /*public  void AddDivision(string Name, DateTime Beginning, DateTime Ending, int? DivisionTypeId, int? CourseId)
                {
                    using (RasporedContext _context = new RasporedContext())
                    {
                        Divisions newDiv = new Divisions
                        {
                            CourseId = CourseId,
                            Beginning = Beginning,
                            Ending = Ending,
                            CreatorId = 1, // TODO: Vadi iz sesije
                            DivisionTypeId = DivisionTypeId,
                            DepartmentId = DepartmentId,
                            Name = Name,
                        };
                        _context.Divisions.Add(newDiv);
                        _context.SaveChanges();
                    }
                }*/
    }
}
