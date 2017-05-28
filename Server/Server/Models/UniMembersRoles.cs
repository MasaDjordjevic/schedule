using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class UniMembersRoles
    {
        public int UniMembersRoleId { get; set; }
        public int UniMemberId { get; set; }
        public int RoleId { get; set; }

        public virtual Roles Role { get; set; }
        public virtual UniMembers UniMember { get; set; }
    }
}
