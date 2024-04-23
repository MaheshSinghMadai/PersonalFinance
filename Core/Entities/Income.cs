using System.ComponentModel.DataAnnotations;

namespace FinancePersonal.Core.Entities
{
    public class Income
    {
        [Key]
        public int IncomeId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Source { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
      
    }
}
