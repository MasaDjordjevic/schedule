using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;
using Server.Extentions;

namespace Server.Controllers
{
    [Produces("application/json")]
    [Route("api/ActivitySchedule")]
    public class ActivityScheduleController : Controller
    {
        private readonly RasporedContext _context;
        private ScheduleService scheduleService;
        private GroupService groupService;

        public ActivityScheduleController(RasporedContext context, ScheduleService scheduleService, GroupService groupService)
        {
            this._context = context;
            this.scheduleService = scheduleService;
            this.groupService = groupService;
        }


        [HttpGet]
        public IActionResult GetCurrentSemesterTimeSpan()
        {
            return Ok(scheduleService.GetCurrentSemesterTimeSpan());
        }


        // asistent
        [HttpGet("{id}", Name = "DeleteGlobalActivity")]
        public IActionResult DeleteGlobalActivity([FromRoute] int id)
        {
            if (!HttpContext.Session.IsAssistant()) return Unauthorized();

            try
            {
                groupService.DeleteActivity(id);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "nije uspelo", message = ex.Message });
            }
        }
    }
}