using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Entities
{
    public class Employee
    {

        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public int DepartmentId { get; set; }

        public int? AddressId { get; set; }

        //[ForeignKey("AddressId")]
        public virtual Address Address { get; set; }

        public virtual Department Department { get; set; }

    }
}
