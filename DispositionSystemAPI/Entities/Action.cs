using System.Collections.Generic;

namespace DispositionSystemAPI.Entities
{
    public class Action
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Lng { get; set; }
        public double Lat { get; set; }
        public virtual List<Employee> Employees { get; set; }
    }
}
