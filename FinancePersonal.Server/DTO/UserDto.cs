using FinancePersonal.Core.Entities;
using Microsoft.AspNetCore.Authentication;

namespace FinancePersonal.Server.DTO
{
    public class UserDto
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime? ExpiresAt { get; set; }
        //public string ReturnUrl { get; set; }
        //public IList<AuthenticationScheme> ExternalLogins { get; set; }
    }
}
