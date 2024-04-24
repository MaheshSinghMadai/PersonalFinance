using ClosedXML.Excel;
using FinancePersonal.Core.Entities;
using FinancePersonal.Infrastructure.Data;
using FinancePersonal.Server.Helper;
using FinancePersonal.Server.Pagination;
using FinancePersonal.Server.ReturnDTOs;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace FinancePersonal.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ExpenseController : Controller
    {
        public const string ExpenseCacheKey = "ExpenseKey";

        private readonly ApplicationDbContext _db;
        private ILogger<ExpenseController> _logger;
        private IMemoryCache _cache;
        public ExpenseController(
            ApplicationDbContext db,
            IMemoryCache cache,
            ILogger<ExpenseController> logger)
        {
            _db = db;
            _cache = cache;
            _logger = logger;
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetExpense()
        {
            try
            {
                return Ok(await _db.Expenses.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetCurrentUserExpense([FromQuery] string userId, [FromQuery] PaginationFilter pageFilter)
        {
            try
            {
                var validFilter = new PaginationFilter(pageFilter.PageNumber, pageFilter.PageSize);
                List<UserExpenseWithCategory> query = new List<UserExpenseWithCategory>();

                if (_cache.TryGetValue(ExpenseCacheKey, out IEnumerable<UserExpenseWithCategory> result))
                {
                    _logger.LogInformation("Expenses found in cache");
                }
                else
                {
                    _logger.LogInformation("Expenses not found in cache. Fetching from database");

                    query = (from e in _db.Expenses
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
                             }).AsNoTracking().ToList();

                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                                                .SetSlidingExpiration(TimeSpan.FromSeconds(60))
                                                .SetAbsoluteExpiration(TimeSpan.FromHours(1))
                                                .SetPriority(CacheItemPriority.Normal)
                                                .SetSize(1);

                    _cache.Set(ExpenseCacheKey, query, cacheEntryOptions);
                }

                var pagedData = query
                                    .Skip((validFilter.PageNumber - 1) * pageFilter.PageSize)
                                    .Take(validFilter.PageSize)
                                    .ToList();
                var totalRecords = query.Count();
                var pagedResponse = PaginationHelper.CreatePagedReponse<UserExpenseWithCategory>(pagedData, validFilter, totalRecords);

                return Ok(pagedResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }          
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddNewExpense(Expense exp)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPatch]
        [Route("[action]")]
        public async Task<IActionResult> EditExpense(int id, JsonPatchDocument<Expense> expense)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpDelete]
        [Route("[action]")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> filterExpense([FromQuery] string userId, [FromQuery] PaginationFilter pageFilter, [FromQuery] ExpenseFilter expenseFilter)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }

        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetMonthlyExpense([FromQuery] string userId)
        {
            try
            {
                var monthlyExp = (from e in _db.Expenses
                                  where e.UserId == userId
                                  group e by e.Date.Month into g
                                  select new
                                  {
                                      Date = g.Key,
                                      TotalAmount = g.Sum(x => x.Amount)
                                  });

                var monthlyExpenseList = monthlyExp.ToListAsync();

                return Ok(await monthlyExpenseList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetMonthwiseCategoricalExpense([FromQuery] string userId)
        {
            try
            {
                var monthlyCategoricalExp = (from e in _db.Expenses
                                             join c in _db.Categories on e.CategoryId equals c.CategoryId
                                             where e.UserId == userId
                                             group new { e, c } by new { e.Date.Month, c.CategoryName } into g
                                             select new
                                             {
                                                 Date = g.Key.Month,
                                                 TotalAmount = g.Sum(x => x.e.Amount),
                                                 CategoryName = g.Key.CategoryName
                                             }).OrderBy(x => x.Date);

                var monthlyCategoricalExpList = monthlyCategoricalExp.ToListAsync();

                return Ok(await monthlyCategoricalExpList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult ExportToExcel([FromQuery] string userId)
        {
            try
            {
                var expenses = (from e in _db.Expenses
                                join c in _db.Categories on e.CategoryId equals c.CategoryId
                                where e.UserId == userId
                                select new UserExpenseWithCategory
                                {
                                    Amount = e.Amount,
                                    Date = e.Date,
                                    Username = e.Username,
                                    Description = e.Description,
                                    CategoryName = c.CategoryName,
                                }).AsNoTracking().ToList();

                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add("Expenses");
                    worksheet.Cell(1, 1).Value = "S.N.";
                    worksheet.Cell(1, 2).Value = "Amount";
                    worksheet.Cell(1, 3).Value = "Date";
                    worksheet.Cell(1, 4).Value = "Username";
                    worksheet.Cell(1, 5).Value = "Category";
                    worksheet.Cell(1, 6).Value = "Description";

                    int row = 2;
                    foreach (var expense in expenses)
                    {
                        worksheet.Cell(row, 1).Value = row - 1;
                        worksheet.Cell(row, 2).Value = expense.Amount;
                        worksheet.Cell(row, 3).Value = expense.Date;
                        worksheet.Cell(row, 4).Value = expense.Username;
                        worksheet.Cell(row, 5).Value = expense.CategoryName;
                        worksheet.Cell(row, 6).Value = expense.Description;
                        row++;
                    }

                    var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    stream.Position = 0;

                    var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    var fileName = "Expenses.xlsx";

                    return File(stream, contentType, fileName);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
