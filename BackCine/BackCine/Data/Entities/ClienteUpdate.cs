using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Entities
{
    public class ClienteUpdate
    {
        public int IdClienteUpdate { get; set; }

        public int IdBarrio { get; set; }

        public string Calle { get; set; }

        public long Altura { get; set; }
    }
}
