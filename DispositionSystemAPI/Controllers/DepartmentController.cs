using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Models;
using DispositionSystemAPI.Repository;
using DispositionSystemAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Controllers
{

    [Route("api/department")]
    [ApiController]
    //[Authorize]
    public class DepartmentController : ControllerBase
    {

        private readonly IDepartmentRepository departmentRepository;
        public DepartmentController(IDepartmentRepository departmentRepository)
        {
            this.departmentRepository = departmentRepository;
        }

        [HttpPut("{id}")]
        public ActionResult Update([FromBody] UpdateDepartmentDto dto, [FromRoute] int id)
        {
            this.departmentRepository.Update(id, dto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id) 
        {
            this.departmentRepository.Delete(id);
            return NoContent();
        }

        [HttpPost]
        //[Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> CreateDepartment([FromBody]CreateDepartmentDto dto)
        {
           // var userId = int.Parse(User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier).Value);
            var id = await this.departmentRepository.Create(dto);
            return Created($"/api/department/{id}", null);
        }
        
        [HttpGet]
        //[Authorize(Policy = "AtLeast18")]
        public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetAll([FromQuery]DepartmentQuery query) 
        {
            var departmentsDtos = await this.departmentRepository.GetAll(query);
            return Ok(departmentsDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDto>> Get([FromRoute]int id) 
        {
            var department = await this.departmentRepository.GetById(id);
            return Ok(department);
        }
    }
}
