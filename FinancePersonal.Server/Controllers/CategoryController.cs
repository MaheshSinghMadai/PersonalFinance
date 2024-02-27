using FinancePersonal.Infrastructure.Data;
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
        public async Task<IActionResult> GetCategoryWiseExpense([FromQuery] int userId, [FromQuery] int categoryId)
        {

            var sumOfAmount = (from e in _db.Expenses
                               join c in _db.Categories on e.CategoryId equals c.CategoryId
                               where e.UserId == userId && c.CategoryId == categoryId
                               select e.Amount).Sum();

            return Ok(sumOfAmount);
        }
    }
}
