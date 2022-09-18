using DispositionSystemAPI.Entities;
using DispositionSystemAPI.HubConfig;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DispositionSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly IHubContext<NotificationHub, INotificationsHub> hubContext;

        public NotificationsController(IHubContext<NotificationHub, INotificationsHub> hubContext)
        {
            this.hubContext = hubContext;
        }

        [HttpGet("{id}")]
        public string Signalr(string id)
        {
            this.hubContext.Clients.Client(id).SendNotification(new Models.Notification() { Id = 1, Content = "test"});


            return "message send to: " + id;
        }
    }
}
