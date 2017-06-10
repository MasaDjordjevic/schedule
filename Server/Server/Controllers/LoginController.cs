using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;
using Server.Extentions;
using Newtonsoft.Json;

namespace Server.Controllers
{
    public class LoginBinding
    {
        public string username;
        public string password;
    }

    [Produces("application/json")]
    [Route("api/Login")]
    public class LoginController : Controller
    {
        private readonly RasporedContext _context;
        private LoginService loginService;
        private StudentService studentService;
        private AssistantService assistantService;
        public LoginController (RasporedContext context, LoginService loginService, StudentService studentService, AssistantService assistantService)
        {
            _context = context;
            this.loginService = loginService;
            this.studentService = studentService;
            this.assistantService = assistantService;
        }

        [HttpGet]
        [Route("LoginRedirect")]
        public IActionResult LoginRedirect()
        {
            UniMembers usr = HttpContext.Session.GetUser();
            if (usr == null)
                return Ok(new { status = "nista" });

            return Redirect(usr);
        }

        [HttpPost]
        [Route("Redirect")]
        public IActionResult Redirect(UniMembers usr)
        {
            //asistent
            if (usr.StudentId == null)
            {
                HttpContext.Session.SetString("role", "assistant");
                return Ok(new { status = "uspelo", url = "/assistant-panel" });
            }
            else //student
            {
                HttpContext.Session.SetString("role", "student");
                return Ok(new { status = "uspelo", url = "/student-panel" });
            }
        }

        [HttpGet]
        public IEnumerable<Classrooms> GetClassrooms()
        {
            return _context.Classrooms;
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login([FromBody] LoginBinding loginData)
        {         
            if (String.IsNullOrEmpty(loginData.username) || String.IsNullOrEmpty(loginData.password))
            {
                return Ok(new { exception = "parameter error" });
            }

            try
            {
                UniMembers usr = loginService.UserLogin(loginData.username, loginData.password);
                HttpContext.Session.SetUser(JsonConvert.DeserializeObject<UniMembers>(
                    (JsonConvert.SerializeObject(usr, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }))));
                return Ok(new { status = "success" });

            }
            catch(Exception ex)
            {
                return Ok(new { exception = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult GetUser()
        {
            //mora ovako ruzno jer se tako ocekuje na frontu
            if (HttpContext.Session.IsStudent())
            {
                var student = studentService.GetStudent(HttpContext.Session.GetStudentId());
                return Ok(JsonConvert.SerializeObject(student, Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    }));
            }

            if (HttpContext.Session.IsAssistant())
            {
                var assistnat = assistantService.GetAssistant(HttpContext.Session.GetAssistantId());

                return Ok(JsonConvert.SerializeObject(assistnat, Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    }));
            }

            return Unauthorized();
        }

        [HttpGet]
        [Route("Logout")]
        public IActionResult Logout()
        {
            try
            {
                HttpContext.Session.SetUser(null);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }

        [HttpGet]
        [Route("IsAllowedStudent")]
        public IActionResult IsAllowedStudent()
        {
            if (HttpContext.Session.IsStudent())
            {
                return Ok(new { status = "uspelo" });
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpGet]
        [Route("IsAllowedAssistant")]
        public IActionResult IsAllowedAssistant()
        {
            if (HttpContext.Session.IsAssistant())
            {
                return Ok(new { status = "uspelo" });
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}