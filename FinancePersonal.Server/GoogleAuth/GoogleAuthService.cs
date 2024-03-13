using FinancePersonal.Core.Entities.Identity;
using FinancePersonal.Infrastructure.Data;
using FinancePersonal.Server.Utils;
using log4net;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace FinancePersonal.Server.GoogleAuth
{
    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly GoogleAuthConfig _googleAuthConfig;
        private readonly ILog _logger;

        public GoogleAuthService(
            UserManager<AppUser> userManager,
            ApplicationDbContext context,
            IOptions<GoogleAuthConfig> googleAuthConfig
            )
        {
            _userManager = userManager;
            _context = context;
            _googleAuthConfig = googleAuthConfig.Value;
            _logger = LogManager.GetLogger(typeof(GoogleAuthService));
        }

        public async Task<AppUser> GoogleSignIn(GoogleSignInDto model)
        {

            Payload payload = new();

            try
            {
                payload = await ValidateAsync(model.IdToken, new ValidationSettings
                {
                    Audience = new[] { _googleAuthConfig.ClientId }
                });

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return new < AppUser > (null, new List<string> { "Failed to get a response." });
            }

            var userToBeCreated = new CreateUserFromSocialLogin
            {
                FirstName = payload.GivenName,
                LastName = payload.FamilyName,
                Email = payload.Email,
                ProfilePicture = payload.Picture,
                LoginProviderSubject = payload.Subject,
            };

            var user = await _userManager.CreateUserFromSocialLogin(_context, userToBeCreated, LoginProvider.Google);

            if (user is not null)
                return new BaseResponse<AppUser>(user);

            else
                return new BaseResponse<AppUser>(null, new List<string> { "Failed to get response." });
        }
    }
}
