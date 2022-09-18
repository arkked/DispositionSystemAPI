using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Models;
using DispositionSystemAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.HubConfig
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class NotificationHub : Hub<INotificationsHub>, INotificationsHub
    {
        private static ConcurrentDictionary<string, User> Users = new ConcurrentDictionary<string, User>();
        private readonly DepartmentDbContext departmentDbContext;
        public NotificationHub(DepartmentDbContext departmentDbContext)
        {
            this.departmentDbContext = departmentDbContext;
        }

        public async Task SendNotification(Notification notification)
        {
             await Clients.Caller.SendNotification(notification);
        }

        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();

            if (httpContext != null)
            {
                var jwtToken = httpContext.Request.Query["access_token"];


                if (!string.IsNullOrEmpty(jwtToken))
                {
                    var token = new JwtSecurityToken(jwtToken);

                    var jti = token.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

                    var userId = int.Parse(jti.Value);

                    var user = departmentDbContext.Users.FirstOrDefault(x => x.Id == userId);
                    user.ConnectionId = Context.ConnectionId;

                    Users.TryAdd(Context.ConnectionId, user);

                    departmentDbContext.SaveChanges();
                }
            }
         
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Users.TryRemove(Context.ConnectionId, out User user);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
