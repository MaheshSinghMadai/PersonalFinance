using FinancePersonal.Core.Entities.Identity;
using FinancePersonal.Infrastructure.Data;
using FinancePersonal.Server.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace FinancePersonal.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ApplicationDbContext _db;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public ProfileController(
            UserManager<AppUser> userManager,
            ApplicationDbContext db,
            IWebHostEnvironment hostingEnvironment)
        {
            _userManager = userManager;
            _hostingEnvironment = hostingEnvironment;
            _db = db;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<ActionResult<UserProfileDto>> GetUserCredentials([FromQuery] string userId)
        {

            var user = await _userManager.FindByIdAsync(userId);

            return new UserProfileDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.UserName,
            };
        }

        [HttpPut]
        [Route("[action]")]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfileDto userProfileDto, [FromQuery] string userId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.FirstName = userProfileDto.FirstName;
            user.LastName = userProfileDto.LastName;
            user.Email = userProfileDto.Email;
            user.UserName = userProfileDto.Username;
            user.DisplayName = userProfileDto.Username;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok();
        }

        [HttpPut]
        [Route("[action]")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto, [FromQuery] string userId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok();
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetProfilePicture([FromQuery] string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(new { profilePicture = user.ProfilePicture });
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> ChangeProfilePicture([FromBody] ProfilePictureDto model, [FromQuery] string userId)
        {      
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.ProfilePicture = model.ProfilePicture;

            _db.Entry(user).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}
