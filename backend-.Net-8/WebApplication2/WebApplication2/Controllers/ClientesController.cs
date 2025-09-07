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
public class ClientesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ClientesController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/clientes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClienteDto>>> GetClientes()
    {
        var clientes = await _context.clientes
            .Include(c => c.Ventas)
            .ToListAsync();

        var clientesDto = _mapper.Map<List<ClienteDto>>(clientes);
        return Ok(clientesDto);
    }

    // GET: api/clientes/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteDto>> GetCliente(int id)
    {
        var cliente = await _context.clientes
            .Include(c => c.Ventas)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cliente == null)
            return NotFound();

        var clienteDto = _mapper.Map<ClienteDto>(cliente);
        return Ok(clienteDto);
    }

    // POST: api/clientes
    [HttpPost]
    public async Task<IActionResult> PostCliente([FromBody] ClienteCreateUpdateDto clienteDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var cliente = _mapper.Map<Cliente>(clienteDto);
        _context.clientes.Add(cliente);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
    }

    // PUT: api/clientes/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCliente(int id, [FromBody] ClienteCreateUpdateDto clienteDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var clienteExistente = await _context.clientes.FindAsync(id);
        if (clienteExistente == null)
            return NotFound();

        _mapper.Map(clienteDto, clienteExistente);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PATCH: api/clientes/5
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchCliente(int id, [FromBody] JsonPatchDocument<ClienteCreateUpdateDto> patchDoc)
    {
        if (patchDoc == null)
            return BadRequest("No se envió ninguna operación de patch.");

        var cliente = await _context.clientes.FindAsync(id);
        if (cliente == null)
            return NotFound("El cliente no existe.");

        var clienteDto = _mapper.Map<ClienteCreateUpdateDto>(cliente);

        patchDoc.ApplyTo(clienteDto, ModelState);
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        TryValidateModel(clienteDto);
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _mapper.Map(clienteDto, cliente);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/clientes/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        var cliente = await _context.clientes.FindAsync(id);
        if (cliente == null)
            return NotFound();

        _context.clientes.Remove(cliente);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
