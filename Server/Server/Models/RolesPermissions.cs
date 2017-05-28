using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class RolesPermissions
    {
        public int RolesPermissionId { get; set; }
        public int RoleId { get; set; }
        public int PermissionId { get; set; }

        public virtual Permissions Permission { get; set; }
        public virtual Roles Role { get; set; }
    }
}
