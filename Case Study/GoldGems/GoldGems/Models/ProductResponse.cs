namespace GoldGems.Models
{
    public class ProductResponse
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal PopularityOutOfFive { get; set; }
        public decimal Weight { get; set; }
        public Dictionary<string, string> Images { get; set; }
    }
}
