using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Exceptions;
using DispositionSystemAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Repository
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly DepartmentDbContext context;
        private readonly IMapper mapper;
        private readonly ILogger<EmployeeRepository> logger;

        public EmployeeRepository(DepartmentDbContext context, IMapper mapper, ILogger<EmployeeRepository> logger)
        {
            this.context = context;
            this.mapper = mapper;
            this.logger = logger;
        }

        public async Task<int> Create(int departmentId, AddEmployeeDto dto)
        {
            var employee = this.mapper.Map<Employee>(dto);
            employee.DepartmentId = departmentId;

            await this.context.Employees.AddAsync(employee);
            this.context.SaveChanges();

            return employee.Id;
        }

        public async Task<List<EmployeeDto>> GetAll(int departmentId)
        {
            var employees = await this.context
                 .Employees
                 .Include(a => a.Address)
                 .Where(e => e.DepartmentId == departmentId)
                 .ToListAsync();

            var employeeDtos = this.mapper.Map<List<EmployeeDto>>(employees);
            return employeeDtos;
        }

        public async Task<EmployeeDto> GetById(int departmentId, int employeeId)
        {
            var employee = await this.context.Employees
              .Include(d => d.Address)
              .FirstOrDefaultAsync(e => e.Id == employeeId);

            if (employee is null || employee.DepartmentId != departmentId)
                throw new NotFoundException("Employee not found");

            var employeeDto = this.mapper.Map<EmployeeDto>(employee);

            return employeeDto;
        }

        public async Task Remove(int departmentId, int employeeId)
        {
            var department = await GetDepartmentById(departmentId);

            var employee = department
                .Employees
                .FirstOrDefault(e => e.Id == employeeId);

            this.context.Remove(employee);
            this.context.SaveChanges();
        }

        public async Task Update(int departmentId, int employeeId, UpdateEmployeeDto dto)
        {
            var department = await GetDepartmentById(departmentId);

            if (department == null) throw new NotFoundException("Employee not found.");

            var employee = department.Employees.FirstOrDefault(d => d.Id == employeeId);

            //var authorizationResult = _authorizationService.AuthorizeAsync(_userContextService.User, department,
            //    new ResourceOperationRequirement(ResourceOperation.Update)).Result;

            //if (!authorizationResult.Succeeded)
            //{
            //    throw new ForbidException("Authorization failed");
            //}

            employee.FirstName = dto.FirstName;
            employee.LastName = dto.LastName;
            employee.Address = mapper.Map<EmployeeAddress>(dto);

            this.logger.LogInformation($"Employee with id: {employeeId} UPDATE action invoked. Updated data: '{employee.FirstName}' to '{dto.FirstName}', '{employee.LastName}' to '{dto.LastName}'");
            this.context.SaveChanges();
        }

        public async Task RemoveAll(int departmentId)
        {
            var department = await GetDepartmentById(departmentId);

            this.context.RemoveRange(department.Employees);
            this.context.SaveChanges();
        }

        private async Task<Department> GetDepartmentById(int departmentId)
        {
            var department = await this.context
                .Departments
                .Include(d => d.Employees)
                .FirstOrDefaultAsync(r => r.Id == departmentId);

            if (department is null)
                throw new NotFoundException("Department not found");

            return department;
        }
    }
}
