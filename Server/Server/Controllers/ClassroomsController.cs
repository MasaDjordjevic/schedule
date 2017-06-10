using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Microsoft.AspNetCore.Cors;
using Server.Services;

namespace Server.Controllers
{
    [Produces("application/json")]
    [Route("api/Classrooms")]
    public class ClassroomsController : Controller
    {
        private readonly RasporedContext _context;
        private ClassroomService classroomsService;

        public ClassroomsController(RasporedContext context, ClassroomService classroomsService)
        {
            _context = context;
            this.classroomsService = classroomsService; 
        }

        // GET: api/Classrooms
        [HttpGet]
        [Route("GetClassrooms")]
        public IEnumerable<Classrooms> GetClassrooms()
        {
            return _context.Classrooms;
        }

        // GET: api/Classrooms/5
        [HttpGet]
        [Route("GetClassrooms/{id}")]
        public async Task<IActionResult> GetClassrooms([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var classrooms = await _context.Classrooms.SingleOrDefaultAsync(m => m.ClassroomId == id);

            if (classrooms == null)
            {
                return NotFound();
            }

            return Ok(classrooms);
        }

        [HttpGet]
        [Route("GetSchedule")]
        public IActionResult GetSchedule(int classroomID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var schedule = classroomsService.GetSchedule(classroomID, weeksFromNow);

            if (schedule == null)
            {
                return NotFound();
            }

            return Ok(schedule);
        }

        // PUT: api/Classrooms/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClassrooms([FromRoute] int id, [FromBody] Classrooms classrooms)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != classrooms.ClassroomId)
            {
                return BadRequest();
            }

            _context.Entry(classrooms).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassroomsExists(id))
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

        // POST: api/Classrooms
        [HttpPost]
        public async Task<IActionResult> PostClassrooms([FromBody] Classrooms classrooms)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Classrooms.Add(classrooms);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClassrooms", new { id = classrooms.ClassroomId }, classrooms);
        }

        // DELETE: api/Classrooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClassrooms([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var classrooms = await _context.Classrooms.SingleOrDefaultAsync(m => m.ClassroomId == id);
            if (classrooms == null)
            {
                return NotFound();
            }

            _context.Classrooms.Remove(classrooms);
            await _context.SaveChangesAsync();

            return Ok(classrooms);
        }

        private bool ClassroomsExists(int id)
        {
            return _context.Classrooms.Any(e => e.ClassroomId == id);
        }
    }
}