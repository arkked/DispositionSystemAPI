using DispositionSystemAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Repository
{
    public interface IEmployeeRepository
    {
        Task<EmployeeDto> GetById(int departmentId, int employeeId);
        Task<List<EmployeeDto>> GetAll(int departmentId);
        Task<int> Create(int departmentId, AddEmployeeDto dto);
        Task RemoveAll(int departmentId);
        Task Remove(int departmentId, int employeeId);
        Task Update(int departmentId, int employeeId, UpdateEmployeeDto dto);


    }
}
