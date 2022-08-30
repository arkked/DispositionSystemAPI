
using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Exceptions;
using DispositionSystemAPI.Models;
using DispositionSystemAPI.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Controllers
{
    [Route("api/action")]
    [ApiController]
    [Authorize]
    public class ActionController : ControllerBase
    {
        private readonly IActionRepository actionRepository;

        public ActionController(IActionRepository actionRepository)
        {
            this.actionRepository = actionRepository;
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateActionDto dto)
        {
            var id = await this.actionRepository.Create(dto);
            return Created($"/api/action/{id}", null);
        }

        [HttpDelete]
        public async Task<ActionResult> Delete([FromBody] int id)
        {       
            await this.actionRepository.Delete(id);
            return NoContent();
        }

    }
}
