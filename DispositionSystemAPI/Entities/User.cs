using DispositionSystemAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string ConnectionId { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime? DateOfBirth {get; set;}

        public string Nationality { get; set; }

        public string Province { get; set; }

        public string PasswordHash { get; set; }

        public int RoleId { get; set; }

        public virtual Role Role { get; set; }

        public virtual List<Notification> Notifications { get; set; }
    }
}
