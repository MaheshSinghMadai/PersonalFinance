using ClosedXML.Excel;
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

        [HttpGet]
        [Route("[action]")]
        public IActionResult ExportToExcel()
        {
            var incomes = _db.Incomes.ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Incomes");
                worksheet.Cell(1, 1).Value = "S.N.";
                worksheet.Cell(1, 2).Value = "Amount";
                worksheet.Cell(1, 3).Value = "Date";
                worksheet.Cell(1, 4).Value = "Source";

                int row = 2;
                foreach (var income in incomes)
                {
                    worksheet.Cell(row, 1).Value = row - 1;
                    worksheet.Cell(row, 2).Value = income.Amount;
                    worksheet.Cell(row, 3).Value = income.Date;
                    worksheet.Cell(row, 4).Value = income.Source;
                    row++;
                }

                var stream = new MemoryStream();
                workbook.SaveAs(stream);
                stream.Position = 0;

                var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                var fileName = "Incomes.xlsx";

                return File(stream, contentType, fileName);
            }
        }
    }
}
