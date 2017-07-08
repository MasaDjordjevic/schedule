using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;
using System.Collections;
using Newtonsoft.Json;

namespace Server.Controllers
{
    [Produces("application/json")]
    [Route("api/Assistants")]
    public class AssistantsController : Controller
    {
        private readonly RasporedContext _context;
        private AssistantService assistantService;

        public AssistantsController(RasporedContext context, AssistantService assistantService)
        {
            _context = context;
            this.assistantService = assistantService;
        }

        [HttpGet]
        [Route("GetAssistants")]
        public IEnumerable GetAssistants()
        {
            return assistantService.GetAllAssistants();
        }

        
        [HttpGet("GetAssistant/{id}")]
        public IActionResult GetAssistant(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var assistant = assistantService.GetAssistant(id);

            if (assistant == null)
            {
                return NotFound();
            }

            return Ok(JsonConvert.SerializeObject(assistant, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }
        
        [HttpGet]
        [Route("GetAssistantsByGroupID/{id}")]
        public IActionResult GetAssistantsByGroupID([FromRoute]int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var assistants = assistantService.GetAssistantsByGroupID(id);

            if (assistants == null)
            {
                return NotFound();
            }

            return Ok(assistants);
        }

        [HttpGet]
        [Route("GetSchedule")]
        public IActionResult GetSchedule(int assistantID, int weeksFromNow)
        {
            //if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var schedule = assistantService.GetSchedule(assistantID, weeksFromNow);

            if (schedule == null)
            {
                return NotFound();
            }

            return Ok(schedule);
        }

    }
}