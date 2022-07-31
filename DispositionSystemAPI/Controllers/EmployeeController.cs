using DispositionSystemAPI.Models;
using DispositionSystemAPI.Repository;
using DispositionSystemAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Controllers
{
    [Route("api/department/{departmentId}/employee")]
    [ApiController]

    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository employeeRepository;

        public EmployeeController(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }

        [HttpPost]
        public ActionResult Post([FromRoute]int departmentId, [FromBody] AddEmployeeDto dto) 
        {
            var newEmpoyeeId = this.employeeRepository.Create(departmentId, dto);

            return Created($"api/department/{departmentId}/employee/{newEmpoyeeId}", null);


        }

        [HttpPut("{employeeId}")]
        public ActionResult Update([FromBody] UpdateEmployeeDto dto, [FromRoute] int departmentId, [FromRoute] int employeeId)
        {
            this.employeeRepository.Update(departmentId, employeeId, dto);
            return Ok();
        }


        [HttpGet("{employeeId}")]
        public ActionResult<EmployeeDto> Get([FromRoute]int departmentId, [FromRoute]int employeeId)
        {
            Task<EmployeeDto> employee = this.employeeRepository.GetById(departmentId, employeeId);
            return Ok(employee.Result);
        }

        [HttpGet]
        public ActionResult<List<EmployeeDto>> Get([FromRoute] int departmentId)
        {
            var result = this.employeeRepository.GetAll(departmentId);
            return Ok(result);
        }

        [HttpDelete]
        public ActionResult Delete([FromRoute] int departmentId)
        {
            this.employeeRepository.RemoveAll(departmentId);
            return NoContent();
        }

        [HttpDelete("{employeeId}")]
        public ActionResult Delete([FromRoute] int departmentId, [FromRoute]int employeeId)
        {
            this.employeeRepository.Remove(departmentId, employeeId);
            return NoContent();
        }

    }
}
