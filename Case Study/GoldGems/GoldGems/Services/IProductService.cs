using System.Collections.Generic;
using System.Threading.Tasks;
using GoldGems.Models;

namespace GoldGems.Services
{
    public interface IProductService
    {
        Task<List<ProductResponse>> GetAllProductsAsync();
    }
}