using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Services
{
    public class LoginService
    {
        private readonly RasporedContext _context;

        public LoginService(RasporedContext context)
        {
            _context = context;
        }

        public UniMembers UserLogin(string username, string password)
        {
            var query = _context.UniMembers
                .Include(a => a.Student)
                .Where(a => a.Username == username && a.Password == password);
            if (query.Any())
            {
                return query.First();
            }
            else
            {
                throw new Exception("Wrong credentials");
            }
        }
    }
}
