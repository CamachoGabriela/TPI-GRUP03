using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Entities
{
    public class AnalisisOcupacionResult
    {
        public int TotalReservas { get; set; }
        public int TotalCompradas { get; set; }
        public string PorcentajeOcupacion { get; set; }
        public string ClienteConMasReservas { get; set; }
        public string PeliculaMasVista { get; set; }

    }
}
