using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Services;
using Newtonsoft.Json;
using Server.Extentions;
using System.Security.Claims;

namespace Server.Controllers
{
    [Produces("application/json")]
    [Route("api/Divisions")]
    public class DivisionsController : Controller
    {
        private readonly RasporedContext _context;
        private DivisionService divisionService;

        public DivisionsController(RasporedContext context, DivisionService divisionService)
        {
            _context = context;
            this.divisionService = divisionService;
        }

        // GET: api/Divisions
        [HttpGet]
        [Route("GetDivisions")]
        public IEnumerable<Divisions> GetDivisions()
        {
            return _context.Divisions;
        }

        [HttpGet]
        [Route("proba")]
        public IActionResult proba()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;

            return Ok(new
            {
                id = HttpContext.User.GetId(),
                role = User.GetRole(),
                user = claimsIdentity
            });

        }

        [HttpPost]
        [Route("probaPost")]
        public IActionResult probaPost([FromBody] DivisionsController.CreateInitialDivisionParameterBinding obj)
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            var c = obj;
            return Ok(new
            {
                id = HttpContext.User.GetId(),
                role = User.GetRole(),
                user = claimsIdentity
            });

        }

        // GET: api/Divisions/5
        [Route("GetDivisions/{id}")]
        public async Task<IActionResult> GetDivisions([FromRoute] int id)
        {
            this.proba();

            var divisions = divisionService.GetDivison(id);

            return Ok(JsonConvert.SerializeObject(divisions, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        [HttpGet]
        [Route("DivideWithX")]
        public IActionResult DivideWithX(int courseID, int x, int sortOrder)
        {
           // if (!HttpContext.Session.IsAssistant()) return Unauthorized();

            var groups = divisionService.DivideWithX(courseID, x, sortOrder);

            if (groups == null)
            {
                return NotFound();
            }

            return Ok(groups);
        }

        [HttpGet]
        [Route("DivideOnX")]
        public IActionResult DivideOnX(int courseID, int x, int sortOrder)
        {
           // if (!HttpContext.Session.IsAssistant()) return Unauthorized();

            var groups = divisionService.DivideOnX(courseID, x, sortOrder);

            if (groups == null)
            {
                return NotFound();
            }

            return Ok(groups);
        }

        [HttpGet]
        [Route("GetDivisionsOfDepartment/{id}")]
        public IActionResult GetDivisionsOfDepartment(int id)
        {
            //if (!HttpContext.Session.IsAssistant()) return Unauthorized();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var divisions = divisionService.GetDivisionsOfDeparmentByType(id);

            if (divisions == null)
            {
                return NotFound();
            }         

            return Ok(JsonConvert.SerializeObject(divisions, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

       

        [HttpGet]
        [Route("GetAllDivisionTypes")]
        public IActionResult GetAllDivisionTypes()
        {
            var divisionTypes = (from a in _context.DivisionTypes select a).ToList();
            return Ok(divisionTypes);
        }

        public class CreateInitialDivisionParameterBinding
        {
            public string name;
            public int departmentID;
            public int courseID;
            public int divisionTypeID;
            public DateTime beginning;
            public DateTime ending;
            public IEnumerable<DivisionService.GroupOfStudents> groups;
        }

        [HttpGet]
        [Route("CopyDivision")]
        public IActionResult CopyDivision(int divisionId)
        {
            //if (!HttpContext.Session.IsAssistant()) return Unauthorized();
                       
            try
            {
                divisionService.CopyDivision(HttpContext.User.GetId(), divisionId);
                return Ok(new { status = "success" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }

        }

     

        [HttpPost]
        [Route("CreateInitialDivision")]
        public IActionResult CreateInitialDivision([FromBody] DivisionsController.CreateInitialDivisionParameterBinding obj)
        {
            //if (!HttpContext.Session.IsAssistant()) return Unauthorized();

            try
            {
                divisionService.CreateInitialDivision(HttpContext.User.GetId(), obj.name, obj.departmentID, obj.courseID, obj.divisionTypeID, obj.beginning, obj.ending, obj.groups.ToList());
                return Ok(new { status = "success" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "error", message = ex.Message });
            }
        }

        //nicemu ne sluzi, inace se ne konvertuju lepo podaci, nzm zasto
        public class DivisionUpdateBinding
        {
            public int? divisionId;
            public string name;
            public DateTime? beginning;
            public DateTime? ending;
            public int? divisionTypeId;
            public int? courseID;
        }

        [HttpPost]
        [Route("UpdateDivision")]
        public IActionResult UpdateDivision([FromBody] DivisionsController.DivisionUpdateBinding obj)
        {
           // if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

            if (obj?.divisionId == null)
                return Ok(new { status = "parameter error" });

            try
            {
                divisionService.UpdateDivision(obj.divisionId.Value, obj.name, obj.beginning, obj.ending, obj.divisionTypeId, obj.courseID);
                return Ok(new { status = "success" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }

        }


        // PUT: api/Divisions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDivisions([FromRoute] int id, [FromBody] Divisions divisions)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != divisions.DivisionId)
            {
                return BadRequest();
            }

            _context.Entry(divisions).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DivisionsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Divisions
        [HttpPost]
        public async Task<IActionResult> PostDivisions([FromBody] Divisions divisions)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Divisions.Add(divisions);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDivisions", new { id = divisions.DivisionId }, divisions);
        }

        [HttpGet]
        [Route("DeleteDivision/{id}")]
        public IActionResult DeleteDivision([FromRoute] int id)
        {            
            if (!HttpContext.User.IsAssistant()) return Unauthorized();
            
            try
            {
                divisionService.DeleteDivision(id);
                return Ok(new { status = "success" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "error", message = ex.Message });
            }
        }

        // DELETE: api/Divisions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDivisions([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var divisions = await _context.Divisions.SingleOrDefaultAsync(m => m.DivisionId == id);
            if (divisions == null)
            {
                return NotFound();
            }

            _context.Divisions.Remove(divisions);
            await _context.SaveChangesAsync();

            return Ok(divisions);
        }

        private bool DivisionsExists(int id)
        {
            return _context.Divisions.Any(e => e.DivisionId == id);
        }
    }
}