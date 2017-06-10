using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Extentions
{
    public static class SessionExtentions
    {
        public static void SetObjectAsJson(this ISession session, string key, object value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static T GetObjectFromJson<T>(this ISession session, string key)
        {
            var value = session.GetString(key);

            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }

        public static UniMembers GetUser(this ISession session)
        {
            return session.GetObjectFromJson<UniMembers>("user");
        }

        public static int GetStudentId(this ISession session)
        {
            var id = session.GetUser().StudentId;
            if (id == null)
                throw new Exception("nije ulogovan");
            return id.Value;
        }

        public static int GetAssistantId(this ISession session)
        {
            return session.GetUser().UniMemberId;
        }

        public static void SetUser(this ISession session, UniMembers user)
        {
            session.SetString("user", JsonConvert.SerializeObject(user));
        }

        public static bool IsStudent(this ISession session)
        {
            string role = session.GetString("role");
            return role == "student";
        }

        public static bool IsAssistant(this ISession session)
        {
            string role = session.GetString("role");
            return role == "assistant";
        }
    }
}
