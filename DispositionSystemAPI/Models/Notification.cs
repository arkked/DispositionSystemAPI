using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace DispositionSystemAPI.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}
