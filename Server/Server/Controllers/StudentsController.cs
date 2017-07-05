using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using Server.Models;
using Server.Services;
using Newtonsoft.Json;
using Server.Extentions;
using Server.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Server.Controllers
{
    [Produces("application/json")]
    [Route("api/Students")]
    public class StudentsController : Controller
    {
        // 2827 - Isidora Nikolic (3. grupa)
        // 2723 - Milena Arsic (2. grupa)
        // 2597 - Aleksandar milanov (1. grupa)
        //public static int STUDENT_ID = 2723;

        private readonly RasporedContext _context;
        private StudentService studentService;
    
        public StudentsController(RasporedContext context, StudentService studentService)
        {
            this._context = context;
            this.studentService = studentService;
        }

        // GET: api/Students
        [HttpGet]
        [Route("GetStudents")]
        public IEnumerable GetStudents()
        {
            return studentService.GetAllStudents();
        }

        // GET: api/Students/GetStudent/{student-id}
        /**
         * Vrati studente ciji je ID prosledjen.
         */
        [HttpGet]
        [Route("GetStudent/{id}")]
        public IActionResult GetStudent(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var student = studentService.GetStudent(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(JsonConvert.SerializeObject(student, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        // GET: api/Students/GetStudents/{group-id}
        /**
         * Vrati studente koji pripadaju grupi ciji je ID prosledjen.
         */
        [HttpGet]
        [Route("GetStudents/{id}")]
        public IActionResult GetStudents([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var students = studentService.GetStudentsOfGroup(id);

            if (students == null)
            {
                return NotFound();
            }
            return Ok(JsonConvert.SerializeObject(students, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        // GET: api/Students/GetStudentsOfDepartment/{department-id}
        // Vrati sve sudente koji pripadaju smeru (department) ciji je ID prosledjen.
        [HttpGet]
        [Route("GetStudentsOfDepartment/{id}")]
        public IActionResult GetStudentsOfDepartment([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var students = studentService.GetStudentsOfDepartment(id);

            if (students == null)
            {
                return NotFound();
            }

            return Ok(students);
        }

        // GET: api/Students/GetStudentsOfCourse/{course-id}
        // Vrati sve sudente koji pripadaju kursu ciji je ID prosledjen.
        [HttpGet]
        [Route("GetStudentsOfCourse/{id}")]
        public IActionResult GetStudentsOfCourse([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var students = studentService.GetStudentsOfCourse(id);

            if (students == null)
            {
                return NotFound();
            }

            return Ok(JsonConvert.SerializeObject(students, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        [HttpGet]
        [Route("GetSchedule")]
        public IActionResult GetSchedule(int studentID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var schedule = studentService.GetSchedule(studentID, weeksFromNow);

            if (schedule == null)
            {
                return NotFound();
            }

            return Ok(schedule);
        }

        [HttpGet]
        [Route("GetPersonalSchedule")]
        public IActionResult GetPersonalSchedule(int studentID, int weeksFromNow)
        {
            //if (!HttpContext.Session.IsStudent()) return Unauthorized();


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var schedule = studentService.GetPersonalSchedule(studentID, weeksFromNow);

            if (schedule == null)
            {
                return NotFound();
            }

            return Ok(schedule);
        }

        [HttpGet]
        [Route("GetOfficialSchedule")]
        public IActionResult GetOfficialSchedule(int studentID, int weeksFromNow)
        {
            //if (!HttpContext.Session.IsStudent()) return Unauthorized();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var schedule = studentService.GetOfficialSchedule(studentID, weeksFromNow);

            if (schedule == null)
            {
                return NotFound();
            }

            return Ok(schedule);
        }

        [HttpGet]
        [Route("AddToGroup")]
        public IActionResult AddToGroup(int studentID, int groupID)
        {
           // if (!HttpContext.Session.IsAssistant()) return Unauthorized();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                studentService.AddToGroup(studentID, groupID);
            }
            catch (InconsistentDivisionException ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }

            return Ok(new { status = "uspelo" });
        }

        [HttpGet]
        [Route("MoveToGroup")]
        public IActionResult MoveToGroup(int studentID, int groupID)
        {
            try
            {
                studentService.MoveToGroup(studentID, groupID);
            }
            catch (InconsistentDivisionException ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(new { status = "success" });
        }

        [HttpGet]
        [Route("RemoveFromGroup")]
        public IActionResult RemoveFromGroup(int studentID, int groupID)
        {

            //if (!HttpContext.Session.IsAssistant()) return Unauthorized();

            try
            {
                if (!studentService.RemoveFromGroup(studentID, groupID))
                {
                    return Ok(new { status = "student not in the group" });
                }
            }
            catch (Exception ex)
            {
                return Ok(new { status = "error", message = ex.Message });
            }

            return Ok(new { status = "success" });
        }

        [HttpGet]
        [Route("HideClass")]
        public IActionResult HideClass(int groupID)
        {
            try
            {
               studentService.HideClass(HttpContext.User.GetId(), groupID);
                return Ok(new { status = "success" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "error", message = ex.Message });
            }

        }

        [HttpGet]
        [Route("AddClassToPersonalSchedule")]
        public IActionResult AddClassToPersonalSchedule(int groupID)
        {
            try
            {
                studentService.AddClassToPersonalSchedule(HttpContext.User.GetId(), groupID);
                return Ok(new { status = "success" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "error", message = ex.Message });
            }
        }

        [HttpGet]
        [Route("AlertClass")]
        public IActionResult AlertClass(int groupID)
        {
            try
            {
                studentService.AlertClass(HttpContext.Session.GetStudentId(), groupID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }

        public class AddActivityBinding
        {
            public int? groupID;
            public int? classroomID;
            public GroupsController.TimeSpanBinding timeSpan;
            public string place;
            public string title;
            public string content;
        }

        [HttpPost]
        [Route("AddActivity")]
        public IActionResult AddActivity([FromBody] AddActivityBinding obj)
        {
            if (!HttpContext.Session.IsStudent()) return Unauthorized();


            if (obj.timeSpan == null)
                return Ok(new { status = "parameter error" });

            try
            {
                //konvertovanje u timeSpan
                TimeSpans ts = Services.TimeSpan.getTimeSpan(obj.timeSpan);

                studentService.AddActivity(HttpContext.Session.GetStudentId(), obj.groupID, obj.classroomID, ts, obj.place, obj.title, obj.content);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }

        [HttpGet]
        [Route("DeleteActivity")]
        public IActionResult DeleteActivity(int activityID)
        {
            if (!HttpContext.Session.IsStudent()) return Unauthorized();


            try
            {
                studentService.DeleteActivity(HttpContext.Session.GetStudentId(), activityID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }

        [HttpGet]
        [Route("DeleteActivity")]
        public IActionResult AlertActivity(int activityID)
        {

            if (!HttpContext.Session.IsStudent()) return Unauthorized();

            try
            {
                studentService.AlertActivity(HttpContext.Session.GetStudentId(), activityID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }
    }
}