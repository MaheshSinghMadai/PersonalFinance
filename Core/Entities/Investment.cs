using System.ComponentModel.DataAnnotations;

namespace FinancePersonal.Core.Entities
{
    public class Investment
    {
        [Key]
        public int InvestmentId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
    }
}
