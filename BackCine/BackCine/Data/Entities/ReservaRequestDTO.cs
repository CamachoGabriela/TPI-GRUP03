using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Entities
{
    public class ReservaRequestDTO
    {
        public Reserva Reserva { get; set; }
        public List<int> ButacasIds { get; set; }
    }
}
