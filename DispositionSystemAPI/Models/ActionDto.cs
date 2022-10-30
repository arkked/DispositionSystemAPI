using System.Collections.Generic;

namespace DispositionSystemAPI.Models
{
    public class ActionDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public List<EmployeeDto> Employees { get; set; }
    }
}
