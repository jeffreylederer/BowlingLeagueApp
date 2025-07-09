using Microsoft.AspNetCore.Hosting.Server;
using ReactType1.Server.Models;
using System;

namespace ReactType1.Server.DTOs
{
    

       

    public class DTOUserRoleCreate
    {
        public required string Username { get; set; }

        public required string Password { get; set; }

        public required string DisplayName { get; set; }

        public bool IsActive { get; set; }

        public int RoleId { get; set; }
    }

    public class DTOUserRoleUpdate
    {
        public int Id { get; set; } 

        public required string DisplayName { get; set; }

        public bool IsActive { get; set; }

        public int RoleId { get; set; }
        
    }

    public class DTOUserRoleDetails
    {
        public int Id { get; set; }

        public required string UserName { get; set; }

        public required string DisplayName { get; set; }

        public bool IsActive { get; set; }

        public string? Role { get; set; }
        public int? RoleId { get; set; }
    }

    public class DTOChangePassword
    {
        public int Id { get; set; }
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }

    }

}
