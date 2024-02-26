using FinancePersonal.Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancePersonal.Infrastructure.Data.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> _userManager)
        {
            if(!_userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "mahesh",
                    Email = "mahesh@test.com",
                    UserName = "mahesh",  
                };
            await _userManager.CreateAsync(user, "P@$$w0rd");
            }
        }
    }
}
