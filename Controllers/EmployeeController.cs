using DispositionSystemAPI.Models;
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
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpPost]
        public ActionResult Post([FromRoute]int departmentId, [FromBody] AddEmployeeDto dto) 
        {
            var newEmpoyeeId = _employeeService.Create(departmentId, dto);

            return Created($"api/department/{departmentId}/employee/{newEmpoyeeId}", null);


        }

        [HttpGet("{employeeId}")]
        public ActionResult<EmployeeDto> Get([FromRoute]int departmentId, [FromRoute]int employeeId)
        {
            EmployeeDto employee = _employeeService.GetById(departmentId, employeeId);
            return Ok(employee);
        }

        [HttpGet]
        public ActionResult<List<EmployeeDto>> Get([FromRoute] int departmentId)
        {
            var result = _employeeService.GetAll(departmentId);
            return Ok(result);
        }

        [HttpDelete]
        public ActionResult Delete([FromRoute] int departmentId)
        {
            _employeeService.RemoveAll(departmentId);
            return NoContent();
        }

        [HttpDelete("{employeeId}")]
        public ActionResult Delete([FromRoute] int departmentId, [FromRoute]int employeeId)
        {
            _employeeService.Remove(departmentId, employeeId);
            return NoContent();
        }

    }
}
