﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BackCine.Data.Entities;

public partial class Funcione
{
    public int IdFuncion { get; set; }

    public int IdPelicula { get; set; }

    public int IdSala { get; set; }

    public DateTime FechaFuncion { get; set; }

    public TimeOnly HsInicio { get; set; }

    public decimal PrecioBase { get; set; }

    public int IdPromocion { get; set; }

    public virtual ICollection<ButacasReservada> ButacasReservada { get; set; } = new List<ButacasReservada>();

    public virtual ICollection<DetalleButaca> DetalleButacas { get; set; } = new List<DetalleButaca>();
    [JsonIgnore]
    public virtual Pelicula IdPeliculaNavigation { get; set; }
    [JsonIgnore]
    public virtual Sala IdSalaNavigation { get; set; }

    public virtual ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}