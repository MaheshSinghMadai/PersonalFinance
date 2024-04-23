using FinancePersonal.Core.Entities.Identity;

namespace FinancePersonal.Core.Interface
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}
