using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Models;
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
    [Authorize]
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
        [Authorize(Roles = "Admin,Manager")]
        public ActionResult CreateDepartment([FromBody]CreateDepartmentDto dto)
        {
            var userId = int.Parse(User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier).Value);
            var id = _departmentService.Create(dto);
            return Created($"/api/department/{id}", null);
        }
        
        [HttpGet]
        [Authorize(Policy = "AtLeast18")]
        public ActionResult<IEnumerable<DepartmentDto>> GetAll([FromQuery]DepartmentQuery query) 
        {
            var departmentsDtos = _departmentService.GetAll(query);
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
