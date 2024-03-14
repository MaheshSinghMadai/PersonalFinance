using FinancePersonal.Core.Entities;
using FinancePersonal.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinancePersonal.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IncomeController : Controller
    {
        private readonly ApplicationDbContext _db;
        public IncomeController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetIncomesList([FromQuery] string userId)
        {
            var incomesList = await (from i in _db.Incomes
                                     where i.UserId == userId
                                     select i).ToListAsync();

            return Ok(incomesList);
        }


        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetTotalIncomePerUser([FromQuery] string userId)
        {
            var totalAmount = await (from i in _db.Incomes
                                     where i.UserId == userId
                                     group i by i.UserId into g
                                     select g.Sum(x => x.Amount)
                                     ).FirstOrDefaultAsync();
                                  
            return Ok(totalAmount);
        }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddNewIncome(Income income)
        {
            var incomes = new Income()
            {
                Amount = income.Amount,
                Date = income.Date,
                Source = income.Source,
                UserId = income.UserId,
                Username = income.Username,
            };

            _db.Add(incomes);
            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}
