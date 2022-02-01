using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Models;
using DispositionSystemAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Controllers
{

    [Route("api/department")]
    [ApiController]

    public class DepartmentController : ControllerBase
    {

        private readonly IDepartmentService _departmentService;

        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpPut("{id}")]
        public ActionResult Update([FromBody] UpdateDepartmentDto dto, [FromRoute] int id)
        {

            _departmentService.Update(id, dto);
       
            return Ok();

        }


        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id) 
        {
            _departmentService.Delete(id);

            return NoContent();

        }


        [HttpPost]
        public ActionResult CreateDepartment([FromBody]CreateDepartmentDto dto)
        {
       
           var id = _departmentService.Create(dto);

            return Created($"/api/department/{id}", null);
        
        }
        

        [HttpGet]
        public ActionResult<IEnumerable<DepartmentDto>> GetAll() 
        {
            var departmentsDtos = _departmentService.GetAll();
            return Ok(departmentsDtos);
        }


        [HttpGet("{id}")]
        public ActionResult<DepartmentDto> Get([FromRoute]int id) 
        {

            var department = _departmentService.GetById(id);
     
            return Ok(department);

        }


    }
}
