using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Exceptions;
using DispositionSystemAPI.Models;
using DispositionSystemAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Repository
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly DepartmentDbContext context;
        private readonly IMapper mapper;
        private readonly ILogger<DepartmentRepository> logger;
        private readonly IAuthorizationService authorizationService;
        private readonly IUserContextService userContextService;

        public DepartmentRepository(DepartmentDbContext context, IMapper mapper, ILogger<DepartmentRepository> logger,
            IAuthorizationService authorizationService, IUserContextService userContextService)
        {
            this.context = context;
            this.mapper = mapper;
            this.logger = logger;
            this.authorizationService = authorizationService;
            this.userContextService = userContextService;
        }

        public async Task<int> Create(CreateDepartmentDto dto)
        {
            var department = this.mapper.Map<Department>(dto);
            //department.CreatedById = _userContextService.GetUserId;
            await this.context.Departments.AddAsync(department);
            this.context.SaveChanges();

            return department.Id;
        }

        public async void Delete(int id)
        {
            this.logger.LogError($"Department with id: {id} DELETE action invoked");


            var department = await this.context
                  .Departments
                  .FirstOrDefaultAsync(d => d.Id == id);

            var address = await this.context.DepartmentAddresses.FirstOrDefaultAsync(d => d.Id == department.AddressId);


            if (department is null) throw new NotFoundException("Department not found");

            
            //var authorizationResult = _authorizationService.AuthorizeAsync(_userContextService.User, department,
            //new ResourceOperationRequirement(ResourceOperation.Delete)).Result;

            //if (!authorizationResult.Succeeded)
            //{
            //    throw new ForbidException("Authorization failed");
            //}


            this.context.DepartmentAddresses.Remove(address);
            this.context.Departments.Remove(department);
            this.context.SaveChanges();
            
           
        }

        public async Task<PagedResult<DepartmentDto>> GetAll(DepartmentQuery query)
        {
            //IOrderedQueryable<Department> direction;
            //PagedResult<DepartmentDto> result;

            var baseQuery = this.context
                .Departments
                .Include(d => d.Address)
                .Include(d => d.Employees).ThenInclude(c => c.Address)
                .Where(d => query.SearchPhrase == null || (d.Name.ToLower().Contains(query.SearchPhrase.ToLower())
                || d.Description.ToLower().Contains(query.SearchPhrase.ToLower())));

            if (!string.IsNullOrEmpty(query.SortBy))
            {

                var columnsSelectors = new Dictionary<string, Expression<Func<Department, object>>>
                {
                    { nameof(Department.Name), d => d.Name },
                    { nameof(Department.Description), d => d.Description },
                    { nameof(Department.Category), d => d.Category },
                };

                var selectedColumn = columnsSelectors[query.SortBy];

                baseQuery = (query.SortDirection == SortDirection.ASC
                    ? baseQuery.OrderBy(selectedColumn)
                    : baseQuery.OrderByDescending(selectedColumn));
             
            }

            var departments = baseQuery
                .Skip(query.PageSize * (query.PageNumber - 1))
                .Take(query.PageSize)
                .ToList();

            var totalItemsCount = departments.Count;

            var departmentsDtos = this.mapper.Map<List<DepartmentDto>>(departments);

            var result = new PagedResult<DepartmentDto>(departmentsDtos, totalItemsCount, query.PageSize, query.PageNumber);

            return result;
        }

        public async Task<DepartmentDto> GetById(int id)
        {
            var department = await this.context
                  .Departments
                  .Include(d => d.Address)
                  .Include(d => d.Employees).ThenInclude(c => c.Address)
                  .FirstOrDefaultAsync(d => d.Id == id);

            if (department is null) throw new NotFoundException("Department not found");

            var result = this.mapper.Map<DepartmentDto>(department);
            return result;
        }

        public async void Update(int id, UpdateDepartmentDto dto)
        {
            var department = await this.context.Departments.FirstOrDefaultAsync(d => d.Id == id);

            if (department is null) throw new NotFoundException("Department not found");

            //var authorizationResult = _authorizationService.AuthorizeAsync(_userContextService.User, department,
            //    new ResourceOperationRequirement(ResourceOperation.Update)).Result;

            //if (!authorizationResult.Succeeded)
            //{
            //    throw new ForbidException("Authorization failed");
            //}

            this.logger.LogInformation($"Department with id: {id} UPDATE action invoked. Updated data: '{department.Name}' to '{dto.Name}', '{department.Description}' to '{dto.Description}'");

            department.Name = dto.Name;
            department.Description = dto.Description;
            department.Category = dto.Category;
            department.ContactEmail = dto.ContactEmail;
            department.ContactNumber = dto.ContactNumber;

            department.Address = mapper.Map<DepartmentAddress>(dto);


            this.context.SaveChanges();

        }
    }
}
