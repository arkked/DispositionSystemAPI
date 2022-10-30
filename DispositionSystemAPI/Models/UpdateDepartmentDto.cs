using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Models
{
    public class UpdateDepartmentDto
    {
        [Required]
        [MaxLength(25)]
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string ContactEmail { get; set; }
        public string ContactNumber { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string PostalCode { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}
