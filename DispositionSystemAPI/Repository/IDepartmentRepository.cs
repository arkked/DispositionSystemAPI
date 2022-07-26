using DispositionSystemAPI.Models;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Repository
{
    public interface IDepartmentRepository
    {
        Task<DepartmentDto> GetById(int id);
        Task<PagedResult<DepartmentDto>> GetAll(DepartmentQuery query);
        Task<int> Create(CreateDepartmentDto dto);
        void Delete(int id);
        void Update(int id, UpdateDepartmentDto dto);
    }
}
