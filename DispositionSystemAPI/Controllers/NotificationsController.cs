using DispositionSystemAPI.Entities;
using DispositionSystemAPI.HubConfig;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {

        private readonly DepartmentDbContext context;
        //   private readonly IHubContext<NotificationHub, INotificationsHub> hubContext;

        public NotificationsController(DepartmentDbContext context)
        {
            this.context = context;
        }

        //[HttpGet("{id}")]
        //public string Signalr(string id)
        //{
        //    this.hubContext.Clients.Client(id).SendNotification(new Models.Notification() { Id = 1, Content = "test"});


        //    return "message send to: " + id;
        //}

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotifications(int id)
        {
            var notifications = await this.context
                .Notifications
                .Where(x => x.UserId == id)
                .ToListAsync();

            if (!notifications.Any())
            {
                return NotFound();
            }

            return Ok(notifications);
        }
    }
}
