using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Extentions
{
    public static class DateTimeExtentions
    {
        public static DateTime DayOfCurrentWeek(this DateTime date)
        {
            int diff = DateTime.Now.DayOfWeek - date.DayOfWeek;
            //if (diff < 0)
            //{
            //    diff += 7;
            //}
            var returnValue = DateTime.Today.AddDays(-1 * diff).Date;
            TimeSpan timeDiff = date.TimeOfDay - returnValue.TimeOfDay;
            returnValue = returnValue.Add(timeDiff);
            return returnValue;

        }

        public static DateTime StartOfWeek(this DateTime date)
        {
            int offset = date.DayOfWeek.ToInt() - DayOfWeek.Monday.ToInt();
            var Day = date.AddDays(-offset);
            return Day.Add(-Day.TimeOfDay);
        }

        public static DateTime EndOfWeek(this DateTime date)
        {
            int offset = date.DayOfWeek.ToInt() - DayOfWeek.Sunday.ToInt();
            var Day = date.AddDays(-offset);
            return Day.Add(-Day.TimeOfDay);
        }

        //ne mogu da koristim obican cast to int jer im nedelja pocinje nedeljom odnosno SunDay = 0, MonDay = 1.. 
        public static int ToInt(this DayOfWeek Day)
        {
            if (Day == DayOfWeek.Sunday)
                return 7;
            else
                return (int)Day;
        }

        public static string ToStr(this DayOfWeek Day)
        {
            switch (Day)
            {
                case DayOfWeek.Monday:
                    return "ponedeljak";
                case DayOfWeek.Tuesday:
                    return "utorak";
                case DayOfWeek.Wednesday:
                    return "sreda";
                case DayOfWeek.Thursday:
                    return "četvrtak";
                case DayOfWeek.Friday:
                    return "petak";
                case DayOfWeek.Saturday:
                    return "subota";
                case DayOfWeek.Sunday:
                    return "nedelja";
                default:
                    return "cudan neki dan";
            }
        }

        public static string ToStr(this DateTime date)
        {
            string ret = date.ToString("dd-MMM");
            ret += " (" + date.DayOfWeek.ToStr() + ") ";
            ret += date.ToString("HH:mm");
            return ret;
        }       
        
        public static DateTime DayOfReferencedWeek(this DateTime date, DateTime refernce, int period)
        {
            while (date.Date < refernce.Date)
            {
                date = date.AddDays(7 * period);
            }
            return date;
        }
    }
}
