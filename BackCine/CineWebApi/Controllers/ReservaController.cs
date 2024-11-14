using BackCine.Data.Entities;
using BackCine.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CineWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservaController : ControllerBase
    {
        private readonly IReservaService _service;

        public ReservaController(IReservaService service)
        {
            _service = service;
        }
        // GET: api/<ReservaController>
        [HttpGet]
        //[Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await _service.GetReservas());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // GET api/<ReservaController>/5
        [HttpGet("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetReservaById(int id)
        {
            try
            {
                return Ok(await _service.GetReservaById(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpGet("Cliente/{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetReservaByCliente(int id)
        {
            try
            {
                return Ok(await _service.GetReservaByCliente(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // POST api/<ReservaController>
        [HttpPost]
        //[Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> Post([FromBody] ReservaRequestDTO request)
        {
            try
            {
                if (request.Reserva == null || request.ButacasIds == null || !request.ButacasIds.Any())
                    return BadRequest("Ingrese una reserva válida con una lista de butacas.");

                var reservaExitosa = await _service.Reservar(request.Reserva, request.ButacasIds);

                if (reservaExitosa)
                {
                    return Ok("Reserva registrada exitosamente.");
                }
                else
                {
                    return Conflict("No se puede realizar la reserva: alguna(s) butaca(s) ya está(n) ocupada(s).");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // PUT api/<ReservaController>/5
        [HttpPut("actualizar-estado/{idButaca}")]
        //[Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> PutState(int idButaca, [FromQuery] int estado, [FromQuery] int idFuncion)
        {
            try
            {
                if (estado == null)
                    return BadRequest("Debe ingresar los datos de la reserva");
                if (idButaca == 0 || idButaca == null )
                    return NotFound("Reserva no encontrada!");
                if(await _service.ActualizarEstado(idButaca, estado, idFuncion))
                {
                    return Ok("Estado de la reserva actualizada exitosamente");
                }
                else
                {
                    return BadRequest("No se puede actualizar el estado de la reserva");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        [HttpPut("cambiar-butacas/{idReserva}")]
        //[Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> PutButaca(int idReserva, [FromBody] List<int> nuevasButacasIds)
        {
            try
            {
                if (nuevasButacasIds == null)
                    return BadRequest("Debe ingresar las butacas que desea seleccionar.");
                if (idReserva  == 0 || idReserva == null)
                    return NotFound("Reserva no encontrada!");
                if(await _service.ActualizarButacas(idReserva, nuevasButacasIds))
                {
                    return Ok("Butaca actualizada exitosamente");
                }
                else
                {
                    return BadRequest("La butaca seleccionada ya está ocupada");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }

        // DELETE api/<ReservaController>/5
        [HttpDelete("{id}")]
        //[Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (id < 1)
                    return BadRequest("Ingrese valores válidos");
                else
                {
                    await _service.CancelarReserva(id);
                    return Ok("Reserva cancelada!");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ha ocurrido un error interno: {ex.Message}");
            }
        }
    }
}
