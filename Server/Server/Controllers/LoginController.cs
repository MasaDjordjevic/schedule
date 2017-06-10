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

        public LoginController (RasporedContext context, LoginService loginService)
        {
            _context = context;
            this.loginService = loginService;
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
    }
}