namespace FinancePersonal.Server.ReturnDTOs
{
    public class ExpenseFilter
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Username { get; set; }
        public string CategoryName { get; set; }
    }
}
