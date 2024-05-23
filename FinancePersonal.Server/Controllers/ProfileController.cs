using FinancePersonal.Core.Entities.Identity;
using FinancePersonal.Infrastructure.Data;
using FinancePersonal.Server.DTO;
using Microsoft.AspNetCore.Hosting;
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
        private readonly IWebHostEnvironment _hostEnvironment;

        public ProfileController(
            UserManager<AppUser> userManager,
            ApplicationDbContext db,
            IWebHostEnvironment hostEnvironment)
        {
            _userManager = userManager;
            _db = db;
            _hostEnvironment = hostEnvironment;
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
                Username = user.UserName
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

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> ChangeProfilePicture([FromForm] ProfilePictureDto model, [FromQuery] string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            //if (_hostEnvironment.WebRootPath == null)
            //{
            //    return StatusCode(StatusCodes.Status500InternalServerError, "Web root path is not configured.");
            //}

            if (model.ProfilePicture != null && model.ProfilePicture.Length > 0)
            {
                var uploads = Path.Combine(_hostEnvironment.ContentRootPath, "uploads");
                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }

                var filePath = Path.Combine(uploads, $"{userId}_{model.ProfilePicture.FileName}");
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ProfilePicture.CopyToAsync(fileStream);
                }

                // Save the relative file path to the database
                user.ProfilePicture = $"/uploads/{userId}_{model.ProfilePicture.FileName}";

            }
            var result = await _userManager.UpdateAsync(user);
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

            if (user == null || string.IsNullOrEmpty(user.ProfilePicture))
            {
                return NotFound("User not found or no profile picture available.");
            }

            var filePath = Path.Combine(_hostEnvironment.ContentRootPath, user.ProfilePicture.TrimStart('/'));
            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(fileBytes, "image/jpeg"); 
        }

    }
}
