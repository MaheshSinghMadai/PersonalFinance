using System.ComponentModel.DataAnnotations;

namespace FinancePersonal.Core.Entities
{
    public class NepsePortfolio
    {
        [Key]
        public int StockId { get; set; }
        public string ScripName { get; set; }
        public int CurrentBalance { get; set; }
        public decimal PreviousClosingPrice { get; set; }
        public decimal ValuesAsOfPreviousClosing { get; set; }
        public decimal LTP { get; set; }
        public decimal ValueAsOfLTP { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
    }
}
