using FinancePersonal.Core.Entities.Identity;
using FinancePersonal.Infrastructure.Data;
using FinancePersonal.Server.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
                return NotFound("User not found.");
            }

            if (string.IsNullOrEmpty(user.ProfilePicturePath))
                return NotFound("Profile picture not found.");

            var imageUrl = $"{Request.Scheme}://{Request.Host}/{user.ProfilePicturePath}";
            return Ok(new { ImageUrl = imageUrl });
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> ChangeProfilePicture(IFormFile profilePicture, [FromQuery] string userId)
        {      
           
            if (profilePicture == null || profilePicture.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsFolder = Path.Combine("uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{profilePicture.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await profilePicture.CopyToAsync(fileStream);
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.ProfilePicturePath = uniqueFileName;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok();
        }
    }
}
