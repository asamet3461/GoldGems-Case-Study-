using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace GoldGems.Services
{
    public class GoldPriceService : IGoldPriceService
    {
        private readonly HttpClient _httpClient;

        // This API key is used to fetch live gold price data from GoldAPI
        private const string ApiKey = "goldapi-1nme1vsmcq7bzei-io";

        public GoldPriceService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("x-access-token", ApiKey);
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        public async Task<decimal> GetCurrentGoldPriceAsync()
        {
            var response = await _httpClient.GetStringAsync("https://www.goldapi.io/api/XAU/USD");

            using var jsonDoc = JsonDocument.Parse(response);
            var ouncePrice = jsonDoc.RootElement.GetProperty("price").GetDecimal();

            // Convert ounce to gram (1 oz = 31.1035 grams)
            var gramPrice = ouncePrice / 31.1035m;

            return decimal.Round(gramPrice, 2);
        }
    }
}
