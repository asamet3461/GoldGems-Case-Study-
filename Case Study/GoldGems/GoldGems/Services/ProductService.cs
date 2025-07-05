using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using GoldGems.Models;
using Microsoft.AspNetCore.Hosting;

namespace GoldGems.Services
{
    public class ProductService : IProductService
    {
        private readonly IWebHostEnvironment _env;
        private readonly IGoldPriceService _goldPriceService;

        public ProductService(IWebHostEnvironment env, IGoldPriceService goldPriceService)
        {
            _env = env;
            _goldPriceService = goldPriceService;
        }

        public async Task<List<ProductResponse>> GetAllProductsAsync()
        {
            var filePath = Path.Combine(_env.WebRootPath, "data", "products.json");

            if (!File.Exists(filePath))
            {
                return new List<ProductResponse>();
            }

            var jsonContent = await File.ReadAllTextAsync(filePath);

            var products = JsonSerializer.Deserialize<List<Product>>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            var currentGoldPrice = await _goldPriceService.GetCurrentGoldPriceAsync();

            var result = products.Select(p => new ProductResponse
            {
                Name = p.Name,
                Weight = p.Weight,
                Images = p.Images,
                PopularityOutOfFive = decimal.Round(p.PopularityScore * 5, 1),
                Price = decimal.Round((p.PopularityScore + 1) * p.Weight * currentGoldPrice, 2)
            }).ToList();

            return result;
        }
    }
}
