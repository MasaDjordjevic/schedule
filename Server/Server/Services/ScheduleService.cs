using Server.DTOs;
using Server.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Services
{
    public class ScheduleService
    {
        private static int colorCounter = -1;
        private readonly RasporedContext _context;

        public ScheduleService(RasporedContext context)
        {
            _context = context;
        }
      

        // prebacuje raspod kao skup casova u raspored po danima u nedelji
        public IEnumerable Convert(List<ScheduleDTO> schedule)
        {
            var ret = new ArrayList();

            var daysOfWeek = Enum.GetValues(typeof(DayOfWeek))
                            .OfType<DayOfWeek>()
                            .OrderBy(day => day < DayOfWeek.Monday);

            // svaki dan mora da postoji bez obzira da li ima casova u njemu
            foreach (DayOfWeek day in daysOfWeek)
            {
                ret.Add(
                    (from a in schedule where a.Day == day select a).ToArray()
                    );
            }

            return ret;
        }

        public Object GetCurrentSemesterTimeSpan()
        {
            return
                _context.ActivitySchedules.Where(a => a.Beginning <= DateTime.Now && DateTime.Now <= a.Ending)
                    .Select(a => new
                    {
                        beginning = a.Beginning,
                        ending = a.Ending,
                    }).First();
        }
    }
}
