using DispositionSystemAPI.Models;
using System.Collections.Generic;

namespace DispositionSystemAPI.Repository
{
    public interface IEmployeeRepository
    {
        EmployeeDto GetById(int departmentId, int employeeId);
        List<EmployeeDto> GetAll(int departmentId);
        int Create(int departmentId, AddEmployeeDto dto);
        void RemoveAll(int departmentId);
        void Remove(int departmentId, int employeeId);
    }
}
