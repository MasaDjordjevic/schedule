using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Server.Extentions
{
    public static class UserExtentions
    {
        public static int GetId(this ClaimsPrincipal user)
        {
            string idStr = user.Identity.Name;
            if (idStr == null)
                throw new Exception("nije ulogovan");
            int id = Convert.ToInt32(idStr);            
            return id;
        }

        public static string GetRole(this ClaimsPrincipal user)
        {
            var claimsIdentity = user.Identity as ClaimsIdentity;
            string role = claimsIdentity.Claims.ToList().FirstOrDefault((c) => c.Type.EndsWith("role")).Value;
            return role;
        }

        public static bool IsStudent(this ClaimsPrincipal user)
        {
            string role = user.GetRole();
            return role == "student";
        }

        public static bool IsAssistant(this ClaimsPrincipal user)
        {
            string role = user.GetRole();
            return role == "assistant";
        }
    }
}
