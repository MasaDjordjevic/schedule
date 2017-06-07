using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;

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
        public IEnumerable<Classrooms> GetClassrooms()
        {
            return _context.Classrooms;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginBinding loginData)
        {         
            if (String.IsNullOrEmpty(loginData.username) || String.IsNullOrEmpty(loginData.password))
            {
                return Ok(new { status = "parameter error" });
            }

            try
            {
                loginService.UserLogin(loginData.username, loginData.password);
                return Ok(new { status = "success" });

            }
            catch(Exception ex)
            {
                return Ok(new { exception = ex.Message });
            }
        }
    }
}