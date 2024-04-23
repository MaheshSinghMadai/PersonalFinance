using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FinancePersonal.Core.Entities
{
    public class Expense
    {
        [Key]
        public int ExpenseId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public int CategoryId { get; set; }
        [JsonIgnore]
        public Category Category { get; set; }
    }
}
