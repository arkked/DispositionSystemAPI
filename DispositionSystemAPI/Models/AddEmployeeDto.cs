using DispositionSystemAPI.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Models
{
    public class AddEmployeeDto
    {
        [Required]
        [MaxLength(25)]
        public string FirstName { get; set; }

        public string LastName { get; set; }

       // public virtual Address Address { get; set; }

        public int DepartmentId { get; set; }

        public double Lat { get; set; }

        public double Lng { get; set; }

        public string City { get; set; }

        public string Street { get; set; }

        public string PostalCode { get; set; }
    }
}
