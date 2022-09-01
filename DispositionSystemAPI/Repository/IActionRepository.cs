using DispositionSystemAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Repository
{
    public interface IActionRepository
    {
        Task<int> Create(CreateActionDto dto);
        Task Delete(int id);

        Task Update(int actionId, UpdateActionDto dto);

        Task<List<ActionDto>> GetAll();

    }
}
