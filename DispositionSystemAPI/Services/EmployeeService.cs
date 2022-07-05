using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Exceptions;
using DispositionSystemAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Services
{

    public interface IEmployeeService
    {
        EmployeeDto GetById(int departmentId, int employeeId);
        List<EmployeeDto> GetAll(int departmentId);
        int Create(int departmentId, AddEmployeeDto dto);       
        void RemoveAll(int departmentId);
        void Remove(int departmentId, int employeeId);
    }



    public class EmployeeService : IEmployeeService
    {
        private readonly DepartmentDbContext _context;
        private readonly IMapper _mapper;

        public EmployeeService(DepartmentDbContext context, IMapper mapper)
        {     
            _context = context;
            _mapper = mapper;
        
        }

        public int Create(int departmentId, AddEmployeeDto dto)
        {
            var employee = _mapper.Map<Employee>(dto);
            employee.DepartmentId = departmentId;

            _context.Employees.Add(employee);
            _context.SaveChanges();

            return employee.Id;

        }

        public EmployeeDto GetById(int departmentId, int employeeId)
        {
           
            var employee = _context.Employees
                .Include(d => d.Address)
                .FirstOrDefault(e => e.Id == employeeId);

            if(employee is null || employee.DepartmentId != departmentId)
                throw new NotFoundException("Employee not found");

            var employeeDto = _mapper.Map<EmployeeDto>(employee);

            return employeeDto;
        }

        public List<EmployeeDto> GetAll(int departmentId)
        {         

            var employees = _context
                .Employees
                .Include(a => a.Address)
                .Where(e => e.DepartmentId == departmentId)
                .ToList();
                
            var employeeDtos = _mapper.Map<List<EmployeeDto>>(employees);
            return employeeDtos;
        }

        public void RemoveAll(int departmentId) 
        {
            var department = GetDepartmentById(departmentId);

            _context.RemoveRange(department.Employees);
            _context.SaveChanges();

        }

        public void Remove(int departmentId, int employeeId)
        {
            var department = GetDepartmentById(departmentId);

            var employee = department
                .Employees
                .FirstOrDefault(e => e.Id == employeeId);

            _context.Remove(employee);
            _context.SaveChanges();
            
        }

        private Department GetDepartmentById(int departmentId)
        {
            var department = _context
                .Departments       
                .Include(d => d.Employees)
                .FirstOrDefault(r => r.Id == departmentId);

            if (department is null)
                throw new NotFoundException("Department not found");

            return department;
        }

    }
}
