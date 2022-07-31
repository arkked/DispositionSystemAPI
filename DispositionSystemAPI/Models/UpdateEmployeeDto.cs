﻿using System.ComponentModel.DataAnnotations;

namespace DispositionSystemAPI.Models
{
    public class UpdateEmployeeDto
    {
        [Required]
        [MaxLength(25)]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string PostalCode { get; set; }
    }
}