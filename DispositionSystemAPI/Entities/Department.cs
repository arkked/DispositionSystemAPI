using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Entities
{
    public class Department
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string ContactEmail { get; set; }

        public string ContactNumber { get; set; }

        public int? CreatedById { get; set; }

        public virtual User CreatedBy { get; set; }

        public int AddressId { get; set; }

        public virtual DepartmentAddress Address { get; set; }

        public virtual List<Employee> Employees { get; set; }


    }
}
