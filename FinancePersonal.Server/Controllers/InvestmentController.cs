using FinancePersonal.Core.Entities;
using FinancePersonal.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinancePersonal.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InvestmentController : Controller
    {
        private readonly ApplicationDbContext _db;
        public InvestmentController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetInvestmentList([FromQuery] string userId)
        {
            var investmentList = await (from i in _db.Investments
                                     where i.UserId == userId
                                     select i).ToListAsync();

            return Ok(investmentList);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetTotalInvestmentPerUser([FromQuery] string userId)
        {
            var totalAmount = await (from i in _db.Investments
                                     where i.UserId == userId
                                     group i by i.UserId into g
                                     select g.Sum(x => x.Amount)
                                     ).FirstOrDefaultAsync();

            return Ok(totalAmount);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddNewInvestment(Investment investment)
        {
            var investments = new Investment()
            {
                Amount = investment.Amount,
                Date = investment.Date,
                Description = investment.Description,
                UserId = investment.UserId,
                Username = investment.Username
            };

            _db.Add(investments);
            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}
