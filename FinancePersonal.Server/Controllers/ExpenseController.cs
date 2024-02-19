using FinancePersonal.Core.Entities;
using FinancePersonal.Infrastructure.Data;
using FinancePersonal.Server.ReturnDTOs;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace FinancePersonal.Server.Controllers
{
    [ApiController]
    public class ExpenseController : Controller
    {
        private readonly ApplicationDbContext _db;
        public ExpenseController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Route("expense")]
        public async Task<IActionResult> GetExpense()
        {
            
            return Ok(await _db.Expenses.ToListAsync());
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetUserExpense()
        {
            var query = (from e in _db.Expenses
                         join u in _db.Users on e.UserId equals u.UserId
                         join c in _db.Categories on e.CategoryId equals c.CategoryId
                         select new UserExpenseWithCategory
                         {
                             ExpenseId = e.ExpenseId,
                             Amount = e.Amount,
                             Date = e.Date,
                             Description = e.Description,
                             Username = u.Name,
                             CategoryName = c.CategoryName
                            }).AsNoTracking().ToListAsync();

            return Ok(await query);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddNewExpense(Expense exp)
        {
            var expenses = new Expense()
            {
                Amount = exp.Amount,
                Date = exp.Date,
                Description = exp.Description,
                UserId = exp.UserId,
                CategoryId = exp.CategoryId
            };

            _db.Add(expenses);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPatch("id")]
        [Route("[action]")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> EditExpense(int id, JsonPatchDocument<Expense> expense)
        {
            var exp = await _db.Expenses.FirstOrDefaultAsync(a => a.ExpenseId == id);
            expense.ApplyTo(exp, ModelState);
            if (ModelState.IsValid)
            {
                _db.Update(exp);
                _db.SaveChanges();
            }

            var model = new
            {
                exp = expense
            };
            return Ok(model);
        }

        [HttpDelete("id")]
        [Route("[action]")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _db.Expenses.FirstOrDefaultAsync(a => a.ExpenseId == id);

            _db.Remove(expense);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
