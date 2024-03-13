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
        public async Task<IActionResult> GetInvestmentList()
        {
            var investmentList = await _db.Investments.ToListAsync();

            return Ok(investmentList);
        }
    }
}
