using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DispositionSystemAPI.Entities
{
    public class EmployeeAddress
    {
        [Key]
        public int Id { get; set; }

        public string City { get; set; }

        public string Street { get; set; }

        public string PostalCode { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
