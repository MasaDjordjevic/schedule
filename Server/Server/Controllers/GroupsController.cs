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
using Server.Exceptions;

namespace Server.Controllers
{
    [Produces("application/json")]
    [Route("api/Groups")]
    public class GroupsController : Controller
    {
        private readonly RasporedContext _context;
        private GroupService groupService;
        private StudentService studentService;

        public GroupsController(RasporedContext context, GroupService groupService, StudentService studentService)
        {
            _context = context;
            this.groupService = groupService;
            this.studentService = studentService;
        }

        // GET: api/Groups
        [HttpGet]
        [Route("GetGroups")]
        public IEnumerable<Groups> GetGroups()
        {
            return _context.Groups;
        }


        [HttpGet]
        [Route("GetAllGroups")]
        public IActionResult GetAllGroups()
        {
            return Ok(groupService.GetAllGroups());
        }

        // [GET] api/Groups/GetGroup/{group-id}
        // Vrati studente ciji je ID prosledjen.
        [HttpGet]
        [Route("GetGroup/{id}")]
        public IActionResult GetGroup(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Groups group = groupService.GetGroup(id);

            if (group == null)
            {
                return NotFound();
            }

            return Ok(JsonConvert.SerializeObject(group, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        // GET: api/Groups/GetGroups/{division-id}
        // Vrati sve grupe koje pripadaju prosledjenoj raspodeli (division).
        [HttpGet]
        [Route("GetGroups/{id}")]
        public IActionResult GetGroups([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var groups = groupService.GetGroupsOfDivision(id);

            if (groups == null)
            {
                return NotFound();
            }

            return Ok(JsonConvert.SerializeObject(groups, Formatting.Indented,
                                    new JsonSerializerSettings
                                    {
                                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                                    }));
        }

        // vraca vreme kada grupa ima cas u naredne 4 nedelje
        [HttpGet]
        [Route("GetActivityTimes/{id}")]
        public IActionResult GetActivityTimes([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var activityTimes = groupService.GetActivityTimes(id);
                return Ok(activityTimes);
            }
            catch (Exception ex)
            {
                return Ok(new { status = "greska", message = ex.Message });
            }
        }

        // vraca termine ostalih grupa raspodele
        [HttpGet]
        [Route("GetAllBulletinBoardChoices/{id}")]
        public IActionResult GetAllBulletinBoardChoices([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var BulletinBoardChoices = groupService.GetAllBulletinBoardChoices(id,
                    HttpContext.Session.GetUser().StudentId); // ne zove getStudentID jer ovako moze da bude i null
                return Ok(BulletinBoardChoices);
            }
            catch (Exception ex)
            {
                return Ok(new { status = "greska", message = ex.Message });
            }
        }

        // vraca oglase koji odgovaraju studentu iz grupe groupID (sa kojima bi mogo da se menja)
        [HttpGet]
        [Route("GetPossibleBulletinBoardChoices/{id}")]
        public IActionResult GetPossibleBulletinBoardChoices([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var BulletinBoardChoices = studentService.GetPossibleBulletinBoardChoices(id);
                return Ok(BulletinBoardChoices);
            }
            catch (Exception ex)
            {
                return Ok(new { status = "greska", message = ex.Message });
            }
        }

        // menja studenta sa onim koji je postavio oglas koji mu odgovara
        [HttpGet]
        [Route("ExcangeStudents/{id}")]
        public IActionResult ExchangeStudents(int groupID, int adID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                studentService.ExchangeStudents(HttpContext.Session.GetStudentId(), groupID, adID);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "greska", message = ex.Message });
            }
        }

        public class AddAdBinding
        {
            public int? groupID;
            public List<int> groupIDs;
        }

        [HttpPost]
        [Route("AddEditAd")]
        public IActionResult AddEditAd([FromBody] AddAdBinding obj)
        {
            if (obj?.groupID == null || obj?.groupIDs == null)
            {
                return Ok(new { status = "parameter error" });
            }
            try
            {
                groupService.AddEditAd(HttpContext.Session.GetStudentId(), obj.groupID.Value, obj.groupIDs);
                return Ok(new { status = "uspelo" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "greska", message = ex.Message });
            }
        }


        public class TimeSpanBinding
        {
            public DateTime? StartDate;
            public DateTime? EndDate;
            public int? Period;
            public int? DayOfWeek;
            public string TimeStart;
            public string TimeEnd;
        }

        public class GroupEditBinding
        {
            public int? groupID;
            public int? classroomID;
            public TimeSpanBinding timespan;
        }

        public class MassGroupEditBinding
        {
            public GroupEditBinding[] groups;
        }

        [HttpPost]
        [Route("MassGroupEdit")]
        public IActionResult MassGroupEdit([FromBody] MassGroupEditBinding obj)
        {
            //if (!HttpContext.Session.IsAssistant()) return Unauthorized();

            if (obj?.groups == null)
            {
                return Ok(new { status = "parameter error" });
            }

            try
            {
                foreach (GroupEditBinding group in obj.groups)
                {
                    if (group.timespan != null)
                    {
                        if (group.timespan.Period == null)
                            return Ok(new { status = "parameter error" });

                        // nzm zasto ovo nece
                        if (group.timespan.StartDate == null)
                            return Ok(new { status = "parameter error" });
                        if (group.timespan.EndDate == null)
                            return Ok(new { status = "parameter error" });

                        if (group.timespan.Period.Value != 0 && (group.timespan.TimeStart == null || group.timespan.TimeEnd == null || group.timespan.DayOfWeek == null))
                            return Ok(new { status = "parameter error" });

                    }

                    //konvertovanje u timeSpan
                    TimeSpans ts = Services.TimeSpan.getTimeSpan(group.timespan);

                    studentService.Update(group.groupID.Value, null, group.classroomID, ts);
                }
                return Ok(new { status = "uspelo" });
            }
            catch (InconsistentDivisionException ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "neuspelo", message = ex.Message });
            }
        }


        //svi parametri moraju da budu nullable da ceo objekat ne bi bio null ukoliko se jedan od paremetara ne posalje
        public class UpdateGroupBinding
        {
            public int? groupID;
            public string name;
            public int? classroomID;
            public IEnumerable<int> students;
            public int? divisionID;
            public int? assistantID;
            public TimeSpanBinding timespan;
        }

        // POST: api/Groups/Update
        [HttpPost]
        [Route("Update")]
        public IActionResult Update([FromBody] GroupsController.UpdateGroupBinding obj)
        {

            if (obj == null)
            {
                return Ok(new { status = "parameter error" });
            }

            if (obj.timespan != null)
            {
                if (obj.timespan.Period == null)
                    return Ok(new { status = "parameter error" });

                if (obj.timespan.Period.Value == 0 && (obj.timespan.StartDate == null || obj.timespan.EndDate == null))
                    return Ok(new { status = "parameter error" });

                if (obj.timespan.Period.Value != 0 && (obj.timespan.TimeStart == null || obj.timespan.TimeEnd == null || obj.timespan.DayOfWeek == null))
                    return Ok(new { status = "parameter error" });

            }

            try
            {

                //konvertovanje u timeSpan
                TimeSpans ts = Services.TimeSpan.getTimeSpan(obj.timespan);

                //dodavanje groupe
                if (obj.groupID == null)
                {
                    if (obj.divisionID == null)
                    {
                        return Ok(new { status = "parameter error" });
                    }
                    //provera konzistentnosti raspodele
                    //Data.Group.CheckConsistencyWithOtherGroups(null, obj.students.ToList());

                    Groups newGroup = groupService.Create(obj.divisionID.Value, obj.name, obj.classroomID,
                        ts);
                    studentService.ChangeStudents(newGroup.GroupId, obj.students.ToList());
                    if (obj.assistantID != null)
                    {
                        groupService.SetAsstant(newGroup.GroupId, obj.assistantID.Value);
                    }
                }
                else //update grupe
                {

                    //provera konzistentnosti raspodele
                    //Data.Group.CheckConsistencyWithOtherGroups(obj.groupID.Value, obj.students.ToList());


                    studentService.Update(obj.groupID.Value, obj.name, obj.classroomID, ts);
                    studentService.ChangeStudents(obj.groupID.Value, obj.students.ToList());
                    if (obj.assistantID != null)
                    {
                        groupService.SetAsstant(obj.groupID.Value, obj.assistantID.Value);
                    }
                }

                return Ok(new { status = "success" });
            }
            catch (InconsistentDivisionException ex)
            {
                return Ok(new { status = "inconsistent division", message = ex.Message });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "error", message = ex.Message });
            }

        }

        public class AddActivityBinding
        {
            public int? groupID;
            public int? classroomID;
            public string place;
            public string title;
            public string content;
            public TimeSpans timespan;
        }

        // POST: api/Groups/AddActivity
        // ako je groupID null onda je to obavestenje za sve
        [HttpPost]
        [Route("AddActivity")]
        public IActionResult AddActivity([FromBody] AddActivityBinding obj)
        {
            try
            {
                groupService.AddActivity(HttpContext.User.GetId(), obj.groupID, obj.classroomID, obj.timespan, obj.place, obj.title, obj.content);
                return Ok(new { status = "success" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "error", message = ex.Message });
            }

        }

        public class CancelClassBinding
        {
            public int groupID;
            public string title;
            public string content;
            public TimeSpans timespan;
        }

        [HttpPost]
        [Route("CancelClass")]
        public IActionResult CancelClass([FromBody] CancelClassBinding obj)
        {
            //if (!HttpContext.Session.IsAssistant()) return Unauthorized();

            if (obj == null)
            {
                return Ok(new { status = "parameter error" });
            }

            try
            {
                groupService.CancelClass(obj.groupID, obj.title, obj.content, obj.timespan);
                return Ok(new { status = "success" });

            }
            catch (Exception ex)
            {
                return Ok(new { status = "error", message = ex.Message });
            }

        }

        [HttpGet]
        [Route("UnCancelClass")]
        public IActionResult UnCancelClass(int activityID)
        {
            //if (!HttpContext.Session.IsAssistant()) return Unauthorized();

            try
            {
                groupService.DeleteActivity(activityID);
                return Ok(new { status = "success" });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "error", message = ex.Message });
            }

        }

        [HttpGet]
        [Route("GetCanceledTimes")]
        public IActionResult GetCanceledTimes(int groupID)
        {
            try
            {
                var times = groupService.GetCanceledTimes(groupID);
                return Ok(times);

            }
            catch (Exception ex)
            {
                return Ok(new { status = "error", message = ex.Message });
            }

        }

        [HttpGet]
        [Route("GetSchedule")]
        public IActionResult GetSchedule(int groupID, int weeksFromNow)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var schedule = groupService.GetCombinedSchedule(groupID, weeksFromNow);

                if (schedule == null)
                {
                    return NotFound();
                }

                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return Ok(new { status = "neuspelo", message = ex.Message });
            }

        }




        // PUT: api/Groups/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGroups([FromRoute] int id, [FromBody] Groups groups)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != groups.GroupId)
            {
                return BadRequest();
            }

            _context.Entry(groups).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GroupsExists(id))
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

        // POST: api/Groups
        [HttpPost]
        public async Task<IActionResult> PostGroups([FromBody] Groups groups)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Groups.Add(groups);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGroups", new { id = groups.GroupId }, groups);
        }

        // DELETE: api/Groups/5
        [HttpDelete("{id}")]
        [Route("DeleteGroups/{id}")]

        public async Task<IActionResult> DeleteGroups([FromRoute] int id)
        {
            try
            {

                var groups = await _context.Groups.SingleOrDefaultAsync(m => m.GroupId == id);
                if (groups == null)
                {
                    return NotFound();
                }

                _context.Groups.Remove(groups);
                await _context.SaveChangesAsync();

                return Ok(new { status = "success" });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    status = "error",
                    message = ex.Message
                });
            }
        }

        private bool GroupsExists(int id)
        {
            return _context.Groups.Any(e => e.GroupId == id);
        }
    }
}