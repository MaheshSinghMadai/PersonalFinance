using Microsoft.AspNetCore.Authentication;

namespace FinancePersonal.Server.DTO
{
    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }

        //public string ReturnUrl { get; set; }
        //public IList<AuthenticationScheme> ExternalLogins { get; set; }
    }
}
