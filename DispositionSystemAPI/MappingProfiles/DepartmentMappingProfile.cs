using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI
{
    public class DepartmentMappingProfile : Profile
    {
        public DepartmentMappingProfile()
        {
            //mapping from object to dto
            CreateMap<Department, DepartmentDto>()
                .ForMember(m => m.City, c => c.MapFrom(s => s.Address.City))
                .ForMember(m => m.Street, c => c.MapFrom(s => s.Address.Street))
                .ForMember(m => m.PostalCode, c => c.MapFrom(s => s.Address.PostalCode));

            //mapping from dto to class object
            CreateMap<CreateDepartmentDto, Department>()
              .ForMember(d => d.Address,
              c => c.MapFrom(dto => new DepartmentAddress()
              { City = dto.City, PostalCode = dto.PostalCode, Street = dto.Street }));


            //mapping from object to dto -NULL ????
            CreateMap<Employee, EmployeeDto>()
                .ForMember(m => m.City, c => c.MapFrom(s => s.Address.City))
                .ForMember(m => m.Street, c => c.MapFrom(s => s.Address.Street))
                .ForMember(m => m.PostalCode, c => c.MapFrom(s => s.Address.PostalCode));


            //mapping from dto to object
            CreateMap<AddEmployeeDto, Employee>()
                .ForMember(d => d.Address, c => c.MapFrom(dto => new EmployeeAddress
                { Street = dto.Street, City = dto.City, PostalCode = dto.PostalCode }));
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        }
    }
}
