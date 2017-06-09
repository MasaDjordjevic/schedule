using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DTOs
{
    public class NotificationDTO
    {
        public int ActivityId { get; set; }
        public string Title { get; set; }
        public string ActivityContent { get; set; }
        public string Place { get; set; }
        public int? ClassroomId { get; set; }
    }
}
