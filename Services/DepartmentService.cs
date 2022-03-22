﻿using AutoMapper;
using DispositionSystemAPI.Authorization;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Exceptions;
using DispositionSystemAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Services
{

    public interface IDepartmentService
    {
        DepartmentDto GetById(int id);
        IEnumerable<DepartmentDto> GetAll();
        int Create(CreateDepartmentDto dto);
        void Delete(int id);
        void Update(int id, UpdateDepartmentDto dto);
    }



    public class DepartmentService : IDepartmentService
    {
        private readonly DepartmentDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ILogger<DepartmentService> _logger;
        private readonly IAuthorizationService _authorizationService;
        private readonly IUserContextService _userContextService;

        public DepartmentService(DepartmentDbContext dbContext, IMapper mapper, ILogger<DepartmentService> logger,
            IAuthorizationService authorizationService, IUserContextService userContextService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _logger = logger;
            _authorizationService = authorizationService;
            _userContextService = userContextService;
        }

        public void Update(int id, UpdateDepartmentDto dto) 
        {

            var department = _dbContext.Departments.FirstOrDefault(d => d.Id == id);

            if (department is null) throw new NotFoundException("Department not found");

            var authorizationResult = _authorizationService.AuthorizeAsync(_userContextService.User, department,
                new ResourceOperationRequirement(ResourceOperation.Update)).Result;

            if (!authorizationResult.Succeeded)
            {
                throw new ForbidException();
            }

            _logger.LogInformation($"Department with id: {id} UPDATE action invoked. Updated data: '{department.Name}' to '{dto.Name}', '{department.Description}' to '{dto.Description}'");

            department.Name = dto.Name;
            department.Description = dto.Description;
            _dbContext.SaveChanges();

        }


        public void Delete(int id) 
        {

            _logger.LogError($"Department with id: {id} DELETE action invoked");


            var department = _dbContext
                  .Departments      
                  .FirstOrDefault(d => d.Id == id);

            if (department is null) throw new NotFoundException("Department not found");

            var authorizationResult = _authorizationService.AuthorizeAsync(_userContextService.User, department,
            new ResourceOperationRequirement(ResourceOperation.Delete)).Result;

            if (!authorizationResult.Succeeded)
            {
                throw new ForbidException();
            }



            _dbContext.Departments.Remove(department);
            _dbContext.SaveChanges();
            
        }

        public DepartmentDto GetById(int id)
        {

            var department = _dbContext
                   .Departments
                   .Include(d => d.Address)
                   .Include(d => d.Employees).ThenInclude(c => c.Address)
                   .FirstOrDefault(d => d.Id == id);

            if (department is null) throw new NotFoundException("Department not found");

            var result = _mapper.Map<DepartmentDto>(department);
            return result;
            
        }


        public IEnumerable<DepartmentDto> GetAll()
        {
            var departments = _dbContext
                .Departments
                .Include(d => d.Address)
                .Include(d => d.Employees).ThenInclude(c => c.Address)
                .ToList();


            var departmentsDtos = _mapper.Map<List<DepartmentDto>>(departments);

            return departmentsDtos;
        }

        //mapowanie z dto na obiekt klasy
        public int Create(CreateDepartmentDto dto)
        {
            var department = _mapper.Map<Department>(dto);
            department.CreatedById = _userContextService.GetUserId;
            _dbContext.Departments.Add(department);
            _dbContext.SaveChanges();

            return department.Id;
        }

    }
}
