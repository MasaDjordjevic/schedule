using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Services;

namespace Server.Controllers
{
    [Produces("application/json")]
    [Route("api/Departments")]
    public class DepartmentsController : Controller
    {
        private readonly RasporedContext _context;
        private DepartmentsService departmentsService;

        public DepartmentsController(RasporedContext context, DepartmentsService departmentsService)
        {
            _context = context;
            this.departmentsService = departmentsService;
        }

        // GET: api/Departments
        [HttpGet]
        [Route("GetDepartments")]
        public IEnumerable<Departments> GetDepartments()
        {
            return _context.Departments;
        }

        [HttpGet]
        [Route("GetDepartmentsByYear")]
        public IActionResult GetDepartmentsByYear()
        {
            //if (!HttpContext.Session.IsAssistant()) return HttpUnauthorized();

            var departments = departmentsService.GetDepartmentsByYear();

            return Ok(departments);
        }


        // GET: api/Departments/5        
        [HttpGet("GetDepartments/{id}")]
        public async Task<IActionResult> GetDepartments([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var departments = await _context.Departments.SingleOrDefaultAsync(m => m.DepartmentId == id);

            if (departments == null)
            {
                return NotFound();
            }

            return Ok(departments);
        }



        [HttpGet]
        [Route("GetSchedule")]
        public IActionResult GetSchedule(int departmentID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var schedule = departmentsService.GetSchedule(departmentID, weeksFromNow);

            if (schedule == null)
            {
                return NotFound();
            }

            return Ok(schedule);
        }

        // PUT: api/Departments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartments([FromRoute] int id, [FromBody] Departments departments)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != departments.DepartmentId)
            {
                return BadRequest();
            }

            _context.Entry(departments).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentsExists(id))
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

        // POST: api/Departments
        [HttpPost]
        public async Task<IActionResult> PostDepartments([FromBody] Departments departments)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Departments.Add(departments);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDepartments", new { id = departments.DepartmentId }, departments);
        }

        // DELETE: api/Departments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartments([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var departments = await _context.Departments.SingleOrDefaultAsync(m => m.DepartmentId == id);
            if (departments == null)
            {
                return NotFound();
            }

            _context.Departments.Remove(departments);
            await _context.SaveChangesAsync();

            return Ok(departments);
        }

        private bool DepartmentsExists(int id)
        {
            return _context.Departments.Any(e => e.DepartmentId == id);
        }
    }
}