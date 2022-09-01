using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Exceptions;
using DispositionSystemAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Repository
{
    public class ActionRepository : IActionRepository
    {
        private readonly DepartmentDbContext context;
        private readonly IMapper mapper;

        public ActionRepository(DepartmentDbContext context, IMapper mapper)
        {       
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<List<ActionDto>> GetAll()
        {
            var actions = await this.context.Actions.ToListAsync();

            var actionDtos = this.mapper.Map<List<ActionDto>>(actions);

            return actionDtos;
        }

        public async Task<int> Create(CreateActionDto dto)
        {
            var action = this.mapper.Map<Action>(dto);

            await this.context.Actions.AddAsync(action);
            await this.context.SaveChangesAsync();

            return action.Id;
        }

        public async Task Delete(int id)
        {
            var action = await this.context.Actions.FirstOrDefaultAsync(x => x.Id == id);

            if (action == null) throw new NotFoundException("Action not found.");

            this.context.Remove(action);
            await this.context.SaveChangesAsync();

        }

        public async Task Update(int actionId, UpdateActionDto dto)
        {
            var action = await this.context.Actions.FirstOrDefaultAsync(x => x.Id == actionId);

            if (action == null) throw new NotFoundException("Action not found.");

            action.Name = dto.Name;

            await this.context.SaveChangesAsync();

        }
    }
}
