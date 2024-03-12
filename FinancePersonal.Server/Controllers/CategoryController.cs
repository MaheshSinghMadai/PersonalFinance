using FinancePersonal.Infrastructure.Data;
using FinancePersonal.Server.ReturnDTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinancePersonal.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _db;
        public CategoryController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetCategoriesList()
        {
            var categoriesList = await _db.Categories.ToListAsync();

            return Ok(categoriesList);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetCategorywiseExpense([FromQuery] string userId, [FromQuery] string category)
        {
            var results = (from e in _db.Expenses
                           join c in _db.Categories on e.CategoryId equals c.CategoryId
                           where e.UserId == userId && c.CategoryName == category
                           select new UserExpenseWithCategory
                           {
                               Amount = e.Amount,
                               Date = e.Date,
                               Description = e.Description,
                               Username = e.Username,
                               CategoryName = c.CategoryName,
                               CategoryId = c.CategoryId
                           }).ToList();

            return Ok(results);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetCategorywiseExpenseCount([FromQuery] string userId)
        {
            var expenseSummary = (from e in _db.Expenses
                                  join c in _db.Categories on e.CategoryId equals c.CategoryId
                                  where e.UserId == userId 
                                  group e by c.CategoryName into g
                                  select new
                                  {
                                      CategoryName = g.Key,
                                      TotalAmount = g.Sum(x => x.Amount)
                                  });
            var categoricalExpneseList = await expenseSummary.ToListAsync();
       
            return Ok(categoricalExpneseList);
        }
    }
}
