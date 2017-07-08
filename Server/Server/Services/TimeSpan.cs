using Server.Controllers;
using Server.Extentions;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Services
{
    public class TimeSpan
    {
        public static TimeSpans Copy(TimeSpans a)
        {
            return new TimeSpans
            {
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                Period = a.Period
            };
        }

        public static bool Overlap(TimeSpans paramA, TimeSpans paramB)
        {
            if(paramA == null || paramB == null)
            {
                return false;
            }
            //moram da kopiram jer se prenosi po referenci
            TimeSpans a = Copy(paramA);
            TimeSpans b = Copy(paramB);

            if (a.Period == null && b.Period == null)
                return DatesOverlap(a.StartDate, a.EndDate, b.StartDate, b.EndDate);

            if (a.Period != null && a.Period > 0)
            {
                a.StartDate = a.StartDate.DayOfReferencedWeek(b.StartDate, a.Period.Value);
                a.EndDate = a.EndDate.DayOfReferencedWeek(b.EndDate, a.Period.Value);
            }

            if (b.Period != null && b.Period > 0)
            {
                b.StartDate = b.StartDate.DayOfReferencedWeek(a.StartDate, b.Period.Value);
                b.EndDate = b.EndDate.DayOfReferencedWeek(a.EndDate, b.Period.Value);
            }

            return TimeSpanOverlap(a, b);
        }

        public static bool DatesOverlap(DateTime aStart, DateTime aEnd, DateTime bStart, DateTime bEnd)
        {
            return ((aStart <= bStart && bStart <= aEnd) || (bStart <= aStart && aStart <= bEnd));
        }

        // proverava da li se SAMO datumi timespanova poklapaju
        public static bool TimeSpanOverlap(TimeSpans a, TimeSpans b)
        {
            return DatesOverlap(a.StartDate, a.EndDate, b.StartDate, b.EndDate);
        }

        public static bool Equal(TimeSpans a, TimeSpans b)
        {
            return a.StartDate == b.StartDate && a.EndDate == b.EndDate;
        }

        //pretvara iz timespana ili formata[dayOfWeek, Period, timeStart, timeEnd] u timespan
        public static TimeSpans getTimeSpan(GroupsController.TimeSpanBinding bind)
        {
            if (bind == null)
                return null;

            TimeSpans ts = new TimeSpans();
            if (bind.Period == 0)
            {
                ts.Period = bind.Period;
                ts.StartDate = bind.StartDate.Value;
                ts.EndDate = bind.EndDate.Value;
                return ts;
            }
            else
            {
                //nedelja je 0
                if (bind.Period == 0)
                    bind.Period = 7;

                DateTime mon = DateTime.Now.StartOfWeek();
                ts.StartDate = mon.AddDays(bind.DayOfWeek.Value - 1);
                ts.EndDate = ts.StartDate;
                ts.StartDate = ts.StartDate.Add(convertHM(bind.TimeStart));
                ts.EndDate = ts.EndDate.Add(convertHM(bind.TimeEnd));
                ts.Period = bind.Period;
            }
            return ts;
        }

        // konvertuje HH:MM u TimeSpan
        public static System.TimeSpan convertHM(string s)
        {
            // za svaki slucaj, iako je format fixan
            int parsePoint = s.IndexOf(":");
            int hour = Int32.Parse(s.Substring(0, parsePoint));
            int min = Int32.Parse(s.Substring(parsePoint + 1));

            System.TimeSpan ts = new System.TimeSpan(hour, min, 0);
            return ts;
        }

        // moze lepse da se organizuje funkcija
        public static string ToString(TimeSpans ts)
        {
            var ret = "";
            if(ts == null)
            {
                return "";
            }
            if (ts.Period != 1)
            {
                ret += ts.StartDate.ToStr();
                if (ts.StartDate.Date != ts.EndDate.Date)
                {
                    ret += " - " + ts.EndDate.ToStr();
                }
                else
                {
                    ret += " - " + ts.EndDate.ToString("HH:mm");
                }
                return ret;
            }
            else
            {
                ret += ts.StartDate.DayOfWeek.ToStr() + " ";
                ret += ts.StartDate.ToString("HH:mm");
                ret += " - " + ts.EndDate.ToString("HH:mm");
            }
            return ret;
        }


    }
}
