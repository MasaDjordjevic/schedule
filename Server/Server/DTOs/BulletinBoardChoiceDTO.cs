using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DTOs
{
    public class BulletinBoardChoiceDTO
    {
        public int GroupId { get; set; }
        public int AdId { get; set; }
        public string Time { get; set; }
        public string Classroom { get; set; }
        public string StudentName { get; set; }
        public bool Chosen { get; set; }
    }
}
