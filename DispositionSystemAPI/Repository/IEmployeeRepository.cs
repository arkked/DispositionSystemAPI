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
        void RemoveAll(int departmentId);
        void Remove(int departmentId, int employeeId);
        void Update(int departmentId, int employeeId, UpdateEmployeeDto dto);


    }
}
