using Microsoft.AspNetCore.Mvc;

namespace FinancePersonal.Server.Controllers
{
    [ApiController]
    public class ExpenseController : Controller
    {
        [HttpGet]
        [Route("action")]
        public IActionResult GetExpense()
        {
            return View();
        }
    }
}
