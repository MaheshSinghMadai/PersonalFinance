namespace FinancePersonal.Server.ReturnDTOs
{
    public class UserExpenseWithCategory
    { 
        public int ExpenseId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public string? Username { get; set; }
        public string? CategoryName { get; set; }
    }
}
