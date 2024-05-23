using Microsoft.AspNetCore.Identity;

namespace FinancePersonal.Core.Entities.Identity
{
    public class AppUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public DateTime expiresAt { get; set; }
        public string ProfilePicture { get; set; }
    }
}
