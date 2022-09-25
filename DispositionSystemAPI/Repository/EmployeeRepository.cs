using AutoMapper;
using DispositionSystemAPI.Authorization;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Exceptions;
using DispositionSystemAPI.HubConfig;
using DispositionSystemAPI.Models;
using DispositionSystemAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
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
        private readonly IAuthorizationService authorizationService;
        private readonly IUserContextService userContextService;
        private readonly IHubContext<NotificationHub, INotificationsHub> notificationsHubContext;

        public EmployeeRepository(DepartmentDbContext context, IMapper mapper, ILogger<EmployeeRepository> logger,
            IAuthorizationService authorizationService, IUserContextService userContextService, IHubContext<NotificationHub, INotificationsHub> notificationsHubContext)
        {
            this.context = context;
            this.mapper = mapper;
            this.logger = logger;
            this.authorizationService = authorizationService;
            this.userContextService = userContextService;
            this.notificationsHubContext = notificationsHubContext;

        }

        public async Task<int> Create(int departmentId, AddEmployeeDto dto)
        {
            var employee = this.mapper.Map<Employee>(dto);
            employee.DepartmentId = departmentId;

            await this.context.Employees.AddAsync(employee);
            await this.context.SaveChangesAsync();

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

            var address = await this.context.EmployeeAddresses.FirstOrDefaultAsync(d => d.Id == employee.AddressId);

            this.context.Remove(address);
            this.context.Remove(employee);
            await this.context.SaveChangesAsync();
        }

        public async Task Update(int departmentId, int employeeId, UpdateEmployeeDto dto)
        {
            var department = await GetDepartmentById(departmentId);

            if (department == null) throw new NotFoundException("Department not found.");

            var employee = department.Employees.FirstOrDefault(d => d.Id == employeeId);

            if (employee == null) throw new NotFoundException("Employee not found.");

            //var authorizationResult = authorizationService.AuthorizeAsync(userContextService.User, department,
            //    new ResourceOperationRequirement(ResourceOperation.Update)).Result;

            //if (!authorizationResult.Succeeded)
            //{
            //    throw new ForbidException("Authorization failed");
            //}

            employee.FirstName = dto.FirstName;
            employee.LastName = dto.LastName;
            employee.Email = dto.Email;
            employee.Address = mapper.Map<EmployeeAddress>(dto);
            employee.Lat = dto.Lat;
            employee.Lng = dto.Lng;
            if (dto.ActionId != null)
            {
                employee.ActionId = dto.ActionId;
            }
            else
            {
                var action = await this.context.Actions.FirstOrDefaultAsync(d => d.Id == employee.ActionId);

                if (action == null) throw new NotFoundException("Action not found.");

                var user = await this.context.Users.FirstOrDefaultAsync(u => u.Email == employee.Email);

                if (user == null) throw new NotFoundException("User not found.");

                var notification = await this.context.Notifications.FirstOrDefaultAsync(x => x.UserId == user.Id);

                if (notification == null) throw new NotFoundException("Notification not found.");
           
                action.Employees.Remove(employee);
                this.context.Notifications.Remove(notification);
            }

            this.logger.LogInformation($"Employee with id: {employeeId} UPDATE action invoked. Updated data: '{employee.FirstName}' to '{dto.FirstName}', '{employee.LastName}' to '{dto.LastName}'");
            await this.context.SaveChangesAsync();
        }

        public async Task RemoveAll(int departmentId)
        {
            var department = await GetDepartmentById(departmentId);

            this.context.RemoveRange(department.Employees);
            await this.context.SaveChangesAsync();
        }

        public async Task<bool> UpdateProfileImage(int departmentId, int employeeId, string profileImageUrl)
        {
            var department = await GetDepartmentById(departmentId);

            if (department == null) throw new NotFoundException("Department not found.");

            var employee = department.Employees.FirstOrDefault(d => d.Id == employeeId);

            if (employee == null) throw new NotFoundException("Employee not found.");

            employee.ProfileImageUrl = profileImageUrl;
            await this.context.SaveChangesAsync();
            return true;
        }

        public async Task AssignToAction(int actionId, int employeeId)
        {
            var employee = await this.context.Employees.FirstOrDefaultAsync(e => e.Id == employeeId);

            if (employee == null) throw new NotFoundException("Employee not found.");

            var user = await this.context.Users.FirstOrDefaultAsync(u => u.Email == employee.Email);

            if (user == null) throw new NotFoundException("User not found.");

            var action = await this.context.Actions.FirstOrDefaultAsync(a => a.Id == actionId);

            if (action == null) throw new NotFoundException("Action not found.");
        
            employee.ActionId = actionId;

            if (action.Employees == null)
            {
                action.Employees = new List<Employee>();           
            }
            action.Employees.Add(employee);

            //TODO send notification here

            var notification = new Notification { Content = action.Name, UserId = user.Id };
            
            await this.context.Notifications.AddAsync(notification);

            if (user.Notifications == null)
            {
                user.Notifications = new List<Notification>();
            }

            user.Notifications.Add(notification);

            await this.notificationsHubContext.Clients.Client(user.ConnectionId).SendNotification(new Notification() { Id = action.Id, Content = action.Name});

            await this.context.SaveChangesAsync();

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
