using DispositionSystemAPI.Entities;

namespace DispositionSystemAPI.Models
{
    public class CreateActionDto
    {
        public string Name { get; set; }

        public double Longitude { get; set; }

        public double Latitude { get; set; }
    }
}
