using System.Threading.Tasks;

namespace GoldGems.Services
{
    public interface IGoldPriceService
    {
        Task<decimal> GetCurrentGoldPriceAsync();
    }
}
