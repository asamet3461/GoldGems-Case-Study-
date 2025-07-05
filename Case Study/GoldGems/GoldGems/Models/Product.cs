namespace GoldGems.Models
{
    public class Product
    {
        public string Name { get; set; }
        public decimal PopularityScore { get; set; }
        public decimal Weight { get; set; }
        public Dictionary<string, string> Images { get; set; }
    }
}
