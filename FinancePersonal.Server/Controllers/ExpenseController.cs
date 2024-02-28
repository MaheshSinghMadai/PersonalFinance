using FinancePersonal.Core.Entities;
using FinancePersonal.Infrastructure.Data;
using FinancePersonal.Server.Helper;
using FinancePersonal.Server.Pagination;
using FinancePersonal.Server.ReturnDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace FinancePersonal.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
        public async Task<IActionResult> GetCurrentUserExpense([FromQuery] string userId)
        {
            var query = (from e in _db.Expenses
                         join c in _db.Categories on e.CategoryId equals c.CategoryId
                         where e.UserId == userId
                         select new UserExpenseWithCategory
                         {
                             ExpenseId = e.ExpenseId,
                             Amount = e.Amount,
                             Date = e.Date,
                             Description = e.Description,
                             Username = e.Username,
                             CategoryName = c.CategoryName,
                             CategoryId = c.CategoryId
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
                CategoryId = exp.CategoryId,
                Username = exp.Username
            };

            _db.Add(expenses);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPatch]
        [Route("[action]")]
        public async Task<IActionResult> EditExpense(int id, JsonPatchDocument<Expense> expense)
        {
            var exp = await _db.Expenses.FirstOrDefaultAsync(a => a.ExpenseId == id);

            if (exp == null)
            {
                return NotFound();
            }

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

        [HttpDelete]
        [Route("[action]")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _db.Expenses.FirstOrDefaultAsync(a => a.ExpenseId == id);


            if (expense == null)
            {
                return NotFound();
            }

            _db.Remove(expense);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> filterExpense([FromQuery] string userId, [FromQuery] PaginationFilter pageFilter, [FromQuery] ExpenseFilter expenseFilter)
        {
            var validFilter = new PaginationFilter(pageFilter.PageNumber, pageFilter.PageSize);

            var results = (from e in _db.Expenses
                           join c in _db.Categories on e.CategoryId equals c.CategoryId
                           where e.UserId == userId
                           select new UserExpenseWithCategory
                           {
                               ExpenseId = e.ExpenseId,
                               Amount = e.Amount,
                               Date = e.Date,
                               Description = e.Description,
                               Username = e.Username,
                               CategoryName = c.CategoryName,
                               CategoryId = c.CategoryId
                           }).ToList();

            var query = results.AsQueryable();

            if (!string.IsNullOrEmpty(expenseFilter.Username))
            {
                query = query.Where(x => x.Username.StartsWith(expenseFilter.Username));
            }
            if (!string.IsNullOrEmpty(expenseFilter.CategoryName))
            {
                query = query.Where(x => x.CategoryName.StartsWith(expenseFilter.CategoryName));
            }
            if (expenseFilter.StartDate.HasValue)
            {
                query = query.Where(x => x.Date >= expenseFilter.StartDate);
            }
            if (expenseFilter.EndDate.HasValue)
            {
                var endDate = expenseFilter.EndDate.Value.AddDays(1);
                query = query.Where(x => x.Date <= expenseFilter.EndDate);
            }

            var pagedData = query
                            .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                            .Take(validFilter.PageSize)
                            .ToList();
            var totalRecords = query.Count();
            var pagedResponse = PaginationHelper.CreatePagedReponse<UserExpenseWithCategory>(pagedData, validFilter, totalRecords);
            return Ok(pagedResponse);

        }
    }
}
