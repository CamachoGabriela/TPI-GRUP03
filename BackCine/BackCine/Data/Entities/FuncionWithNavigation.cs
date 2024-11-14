using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackCine.Data.Entities
{
    public class FuncionWithNavigation
    {
        public int IdFuncion { get; set; }

        public int IdPelicula { get; set; }

        public int IdSala { get; set; }

        public DateTime FechaFuncion { get; set; }

        public TimeOnly HsInicio { get; set; }

        public decimal PrecioBase { get; set; }

        public int IdPromocion { get; set; }
        public string Descripcion { get; set; }
        public string PeliculaDescripcion { get; set; }
        public string SalaDescripcion { get; set; }
    }
}
