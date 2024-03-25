using CsvHelper;
using FinancePersonal.Core.Entities;
using FinancePersonal.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;

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

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> ImportNepseCSV(IFormFile file, [FromQuery] string userId, [FromQuery] string username)
        {
            //remove existing data first
            var existingData = await _db.NepsePortfolios.Where(x=> x.UserId == userId).ToListAsync();
            _db.NepsePortfolios.RemoveRange(existingData);
            await _db.SaveChangesAsync();

            //read contents of csv and add it to database
            using (var reader = new StreamReader(file.OpenReadStream()))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var records = csv.GetRecords<NepsePortfolio>().ToList();

                // Exclude StockId-PK column from records 
                foreach (var record in records)
                {
                    record.StockId = 0;
                    record.Username = username;
                    record.UserId = userId;
                }

                _db.NepsePortfolios.AddRange(records);
                await _db.SaveChangesAsync();
            }
            return Ok();
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetMyNepsePortfolio([FromQuery] string userId)
        {
            var nepseData = await (from n in _db.NepsePortfolios
                                   where n.UserId == userId
                                   select n).ToListAsync();

            return Ok(nepseData);
        }
    }
}
