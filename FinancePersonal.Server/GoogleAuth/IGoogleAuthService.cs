using FinancePersonal.Core.Entities.Identity;
using FinancePersonal.Server.DTO;

namespace FinancePersonal.Server.GoogleAuth
{
    public interface IGoogleAuthService
    {
        Task<AppUser> GoogleSignIn(GoogleSignInDto model);
    }
}
