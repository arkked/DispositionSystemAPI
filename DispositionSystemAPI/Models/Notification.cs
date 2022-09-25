using System.Collections.Generic;

namespace DispositionSystemAPI.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public int? UserId { get; set; }

        public string Content { get; set; }

    }
}
