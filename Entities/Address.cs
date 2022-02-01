using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Entities
{
    public class Address
    {
        public int Id { get; set; }
        
        public string City { get; set; }
       
        public string Street { get; set; }
       
        public string PostalCode { get; set; }
        
        public virtual Department Department { get; set; }

        public virtual Employee Employee { get; set; }

    }
}
