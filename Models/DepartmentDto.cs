using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Models
{
    public class DepartmentDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string City { get; set; }

        public string  Street { get; set; }

        public string PostalCode { get; set; }

        public List<EmployeeDto> Employees { get; set; }

    }
}
