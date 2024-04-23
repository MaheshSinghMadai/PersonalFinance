using System.ComponentModel.DataAnnotations;

namespace FinancePersonal.Core.Entities
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public ICollection<Expense> Expenses { get; set; }
    }
}
