using DispositionSystemAPI.Models;
using DispositionSystemAPI.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Controllers
{
    [Route("api/department")]
    [ApiController]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository departmentRepository;
        public DepartmentController(IDepartmentRepository departmentRepository)
        {
            this.departmentRepository = departmentRepository;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update([FromBody] UpdateDepartmentDto dto, [FromRoute] int id)
        {
            await this.departmentRepository.Update(id, dto);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int id) 
        {
            await this.departmentRepository.Delete(id);
            return NoContent();
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> CreateDepartment([FromBody]CreateDepartmentDto dto)
        {
            var id = await this.departmentRepository.Create(dto);
            return Created($"/api/department/{id}", null);
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetAll() 
        {
            var departmentsDtos = await this.departmentRepository.GetAll();
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
