using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DTOs
{
    public class ScheduleDTO
    {
        public DayOfWeek Day { get; set; }
        public int StartMinutes { get; set; }
        public int DurationMinutes { get; set; }
        public bool Active { get; set; }
        public string Color { get; set; }
        public bool IsClass { get; set; }

        //class
        public int GroupId { get; set; }
        public string ClassName { get; set; }
        public string Abbr { get; set; }
        public string Classroom { get; set; }
        public AssistantNameMailDTO Assistant { get; set; }
        public string Type { get; set; }
        public List<NotificationDTO> Notifications { get; set; }

        //Activity
        public int ActivityId { get; set; }
        public string ActivityTitle { get; set; }
        public string ActivityContent { get; set; }

        //global Activity
        public string Place { get; set; }
    }
}
