using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

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
