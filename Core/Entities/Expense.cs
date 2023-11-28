using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancePersonal.Core.Entities
{
    public class Expense
    {
        [Key]
        public int ExpenseId { get; set; }
        public int CategoryName { get; set; }
        public int Amount { get; set; }
        public DateTime Date { get; set; }
    }
}
