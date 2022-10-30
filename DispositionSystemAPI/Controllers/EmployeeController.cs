using DispositionSystemAPI.Models;
using DispositionSystemAPI.Repository;
using DispositionSystemAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Controllers
{
    [Route("api/department/{departmentId}/employee")]
    [ApiController]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository employeeRepository;

        public EmployeeController(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromRoute]int departmentId, [FromBody] AddEmployeeDto dto) 
        {
            var newEmpoyeeId = await this.employeeRepository.Create(departmentId, dto);

            return Created($"api/department/{departmentId}/employee/{newEmpoyeeId}", null);
        }

        [HttpPut("{employeeId}")]
        public async Task<ActionResult> Update([FromBody] UpdateEmployeeDto dto, [FromRoute] int departmentId, [FromRoute] int employeeId)
        {
            await this.employeeRepository.Update(departmentId, employeeId, dto);
            return Ok();
        }


        [HttpGet("{employeeId}")]
        public async Task<ActionResult<EmployeeDto>> Get([FromRoute]int departmentId, [FromRoute]int employeeId)
        {
            EmployeeDto employee = await this.employeeRepository.GetById(departmentId, employeeId);
            return Ok(employee);
        }

        [HttpGet]
        public async Task<ActionResult<List<EmployeeDto>>> Get([FromRoute] int departmentId)
        {
            var result = await this.employeeRepository.GetAll(departmentId);
            return Ok(result);
        }


        [HttpDelete]
        public async Task<ActionResult> Delete([FromRoute] int departmentId)
        {
            await this.employeeRepository.RemoveAll(departmentId);
            return NoContent();
        }

        [HttpDelete("{employeeId}")]
        public async Task<ActionResult> Delete([FromRoute] int departmentId, [FromRoute]int employeeId)
        {
            await this.employeeRepository.Remove(departmentId, employeeId);
            return NoContent();
        }

        [HttpPost("{employeeId}")]
        public async Task<ActionResult> AssignToAction([FromRoute] int employeeId, [FromBody] string actionId)
        {
            var actionInt = int.Parse(actionId);
            
            await this.employeeRepository.AssignToAction(actionInt, employeeId);
            return Ok();
        }
    }

}