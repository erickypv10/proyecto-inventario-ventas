using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication2.Models;
using WebApplication2.Data;
using WebApplication2.Dto;

[ApiController]
[Route("api/[controller]")]
public class VentasController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public VentasController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/ventas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VentasDto>>> GetVentas()
    {
        var ventas = await _context.ventas
            .Include(v => v.Cliente)
            .Include(v => v.Producto)
            .ToListAsync();

        var ventasDto = _mapper.Map<List<VentasDto>>(ventas);
        return Ok(ventasDto);
    }

    // GET: api/ventas/5
    [HttpGet("{id}")]
    public async Task<ActionResult<VentasDto>> GetVenta(int id)
    {
        var venta = await _context.ventas
            .Include(v => v.Cliente)
            .Include(v => v.Producto)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (venta == null)
            return NotFound();

        var ventaDto = _mapper.Map<VentasDto>(venta);
        return Ok(ventaDto);
    }

    [HttpPost]
    public async Task<IActionResult> PostVenta([FromBody] VentasCreateUpdateDto ventaDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Validar cliente y producto
        var clienteExiste = await _context.clientes.AnyAsync(c => c.Id == ventaDto.ClienteId);
        if (!clienteExiste)
            return BadRequest($"El cliente con ID {ventaDto.ClienteId} no existe.");

        var producto = await _context.productos.FindAsync(ventaDto.ProductoId);
        if (producto == null)
            return BadRequest($"El producto con ID {ventaDto.ProductoId} no existe.");

        if (producto.stock < ventaDto.Cantidad)
            return BadRequest($"Stock insuficiente. Stock disponible: {producto.stock}");

        // Crear venta
        var venta = _mapper.Map<Venta>(ventaDto);
        venta.Total = ventaDto.Cantidad * ventaDto.PrecioUnitario;
        venta.FechaVenta = DateTime.UtcNow;

        // Actualizar stock
        producto.stock -= ventaDto.Cantidad;

        // Guardar cambios
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.ventas.Add(venta);
            _context.productos.Update(producto);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            return StatusCode(500, "Error al guardar la venta.");
        }

        return CreatedAtAction(nameof(GetVenta), new { id = venta.Id }, venta);
    }

    // PUT: api/ventas/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutVenta(int id, [FromBody] VentasCreateUpdateDto ventaDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var ventaExistente = await _context.ventas.FindAsync(id);
        if (ventaExistente == null)
            return NotFound();

        _mapper.Map(ventaDto, ventaExistente);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PATCH: api/ventas/5
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchVenta(int id, [FromBody] JsonPatchDocument<VentasCreateUpdateDto> patchDoc)
    {
        if (patchDoc == null)
            return BadRequest("No se envió ninguna operación de patch.");

        var venta = await _context.ventas.FindAsync(id);
        if (venta == null)
            return NotFound("La venta no existe.");

        var ventaDto = _mapper.Map<VentasCreateUpdateDto>(venta);

        patchDoc.ApplyTo(ventaDto, ModelState);
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        TryValidateModel(ventaDto);
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _mapper.Map(ventaDto, venta);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/ventas/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVenta(int id)
    {
        var venta = await _context.ventas.FindAsync(id);
        if (venta == null)
            return NotFound();

        _context.ventas.Remove(venta);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
