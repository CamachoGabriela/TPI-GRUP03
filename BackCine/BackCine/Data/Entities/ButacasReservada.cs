﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BackCine.Data.Entities;

public partial class ButacasReservada
{
    public int IdReserva { get; set; }

    public int IdButaca { get; set; }

    public int IdFuncion { get; set; }

    public int IdSala { get; set; }

    public virtual Butaca Butaca { get; set; }
    [JsonIgnore]
    public virtual Funcione IdFuncionNavigation { get; set; }
    [JsonIgnore]
    public virtual Reserva IdReservaNavigation { get; set; }
}