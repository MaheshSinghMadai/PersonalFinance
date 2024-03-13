using System.ComponentModel.DataAnnotations;

namespace FinancePersonal.Server.DTO
{
    public class GoogleSignInDto
    {
        [Required]
        public string IdToken { get; set; }
    }
}
