
using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Exceptions;
using DispositionSystemAPI.Models;
using DispositionSystemAPI.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Controllers
{
    [Route("api/actions")]
    [ApiController]
    [Authorize]
    public class ActionController : ControllerBase
    {
        private readonly IActionRepository actionRepository;

        public ActionController(IActionRepository actionRepository)
        {
            this.actionRepository = actionRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActionDto>>> GetAll()
        {
            var actionsDtos = await this.actionRepository.GetAll();
            return Ok(actionsDtos);
        }


        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateActionDto dto)
        {
            var id = await this.actionRepository.Create(dto);
            return Created($"/api/actios/{id}", null);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            await this.actionRepository.Delete(id);
            return NoContent();
        }

        [HttpPut("{actionId}")]
        public async Task<ActionResult> Update([FromRoute] int actionId, [FromBody] UpdateActionDto dto)
        {
            await this.actionRepository.Update(actionId, dto);
            return Ok();
        }
    }
}
