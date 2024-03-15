﻿using FinancePersonal.Core.Entities.Identity;
using FinancePersonal.Core.Interface;
using FinancePersonal.Infrastructure.Data;
using FinancePersonal.Server.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FinancePersonal.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;
        private readonly ApplicationDbContext _db;
        public AccountController(
            UserManager<AppUser> userManager, 
            IConfiguration config,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            ApplicationDbContext db)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));
            _db = db;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto, string returnUrl)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if(user == null)
            {
                return Unauthorized();
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if(!result.Succeeded) 
            {
                return Unauthorized();
            }

            return new UserDto
            {
                UserId = user.Id,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName,
                Email = user.Email,
                ExpiresAt = DateTime.Now.AddMinutes(30),
            };
        }
     

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var user = new AppUser
            {
                UserName = registerDto.Username,
                DisplayName = registerDto.Username,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password) ;
            if (!result.Succeeded)
            {
                return BadRequest();
            }

            return Ok();
        }


        [HttpPost("refresh-token")]
        public IActionResult RefreshToken([FromBody] UserDto user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.Username)
            };

            try
            {
                var identity = HttpContext.User.Identity as ClaimsIdentity;
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddMinutes(30),
                    SigningCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                user.Token = tokenHandler.WriteToken(token);
                //user.DisplayName = identity.FindFirst("GivenName").Value;
                user.ExpiresAt = tokenDescriptor.Expires;

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = new { code = "Internal Server Error", message = ex.GetBaseException().Message } });
            }
        }
    }
}