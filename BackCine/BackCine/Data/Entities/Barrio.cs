using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BackCine.Data.Entities
{
    public class Barrio
    {
        public int IdBarrio { get; set; }

        public string Barrio1 { get; set; }

        public int IdCiudad { get; set; }
        [JsonIgnore]
        public virtual ICollection<Cliente> Clientes { get; set; } = new List<Cliente>();
    
}
}
