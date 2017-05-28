using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Roles
    {
        public Roles()
        {
            RolesPermissions = new HashSet<RolesPermissions>();
            UniMembersRoles = new HashSet<UniMembersRoles>();
        }

        public int RoleId { get; set; }
        public string Name { get; set; }

        public virtual ICollection<RolesPermissions> RolesPermissions { get; set; }
        public virtual ICollection<UniMembersRoles> UniMembersRoles { get; set; }
    }
}
