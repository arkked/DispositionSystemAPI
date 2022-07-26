using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Exceptions;
using DispositionSystemAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DispositionSystemAPI.Repository
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly DepartmentDbContext context;
        private readonly IMapper mapper;

        public EmployeeRepository(DepartmentDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public int Create(int departmentId, AddEmployeeDto dto)
        {
            var employee = this.mapper.Map<Employee>(dto);
            employee.DepartmentId = departmentId;

            this.context.Employees.Add(employee);
            this.context.SaveChanges();

            return employee.Id;
        }

        public List<EmployeeDto> GetAll(int departmentId)
        {
            var employees = this.context
                 .Employees
                 .Include(a => a.Address)
                 .Where(e => e.DepartmentId == departmentId)
                 .ToList();

            var employeeDtos = this.mapper.Map<List<EmployeeDto>>(employees);
            return employeeDtos;
        }

        public EmployeeDto GetById(int departmentId, int employeeId)
        {
            var employee = this.context.Employees
              .Include(d => d.Address)
              .FirstOrDefault(e => e.Id == employeeId);

            if (employee is null || employee.DepartmentId != departmentId)
                throw new NotFoundException("Employee not found");

            var employeeDto = this.mapper.Map<EmployeeDto>(employee);

            return employeeDto;
        }

        public void Remove(int departmentId, int employeeId)
        {
            var department = GetDepartmentById(departmentId);

            var employee = department
                .Employees
                .FirstOrDefault(e => e.Id == employeeId);

            this.context.Remove(employee);
            this.context.SaveChanges();
        }

        public void RemoveAll(int departmentId)
        {
            var department = GetDepartmentById(departmentId);

            this.context.RemoveRange(department.Employees);
            this.context.SaveChanges();
        }

        private Department GetDepartmentById(int departmentId)
        {
            var department = this.context
                .Departments
                .Include(d => d.Employees)
                .FirstOrDefault(r => r.Id == departmentId);

            if (department is null)
                throw new NotFoundException("Department not found");

            return department;
        }
    }
}
