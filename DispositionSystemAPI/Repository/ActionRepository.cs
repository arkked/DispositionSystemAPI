using AutoMapper;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Exceptions;
using DispositionSystemAPI.Models;
using Microsoft.EntityFrameworkCore;
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
    }
}
