using System.ComponentModel.DataAnnotations;

namespace FinancePersonal.Server.DTO
{
    public class SocialLoginRequest
    {
        public string Email { get; set; }
        [Required] 
        public string Provider { get; set; }
        [Required] 
        public string AccessToken { get; set; }
    }
}
