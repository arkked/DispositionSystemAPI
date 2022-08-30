using DispositionSystemAPI.Models;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Repository
{
    public interface IActionRepository
    {
        Task<int> Create(CreateActionDto dto);
        Task Delete(int id);

    }
}
