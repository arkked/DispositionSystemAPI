using DispositionSystemAPI.Models;
using System.Threading.Tasks;

namespace DispositionSystemAPI.HubConfig
{
    public interface INotificationsHub
    {
        Task SendNotification(Notification notification);

    }
}
