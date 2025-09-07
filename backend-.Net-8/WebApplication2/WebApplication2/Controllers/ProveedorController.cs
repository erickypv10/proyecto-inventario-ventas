using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication2.Data;
using WebApplication2.Dto;
using WebApplication2.Models;


[ApiController]
[Route("api/[controller]")]
public class ProveedorController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ProveedorController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/proveedor
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProveedorSimpleDto>>> Get()
    {
        var proveedores = await _context.proveedores
           .ToListAsync();


        return _mapper.Map<List<ProveedorSimpleDto>>(proveedores);
    }

    // GET: api/proveedor/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProveedorDto>> Get(int id)
    {
        var proveedor = await _context.proveedores
            .Include(p => p.Productos)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (proveedor == null) return NotFound();

        return _mapper.Map<ProveedorDto>(proveedor);
    }

    // POST: api/proveedor
    [HttpPost]
    public async Task<ActionResult> Post([FromBody] ProveedorCreateDto proveedorDTO)
    {
        var proveedor = new Proveedor
        {
            Nombre = proveedorDTO.Nombre,
            Telefono = proveedorDTO.Telefono,
            Direccion = proveedorDTO.Direccion,
            ProveedorCategorias = proveedorDTO.CategoriaIds.Select(id => new ProveedorCategoria
            {
                CategoriaId = id
            }).ToList()
        };

        _context.Add(proveedor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = proveedor.Id }, null);
    }


    // PUT: api/proveedor/5
    [HttpPut("{id:int}")]
    public async Task<ActionResult> Put(int id, [FromBody] ProveedorCreateDto proveedorDTO)
    {
        var existe = await _context.proveedores.AnyAsync(p => p.Id == id);
        if (!existe) return NotFound();

        var proveedor = _mapper.Map<Proveedor>(proveedorDTO);
        proveedor.Id = id;
        _context.Update(proveedor);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // PATCH: api/proveedor/5
    [HttpPatch("{id:int}")]
    public async Task<ActionResult> Patch(int id, [FromBody] JsonPatchDocument<ProveedorPatchDto> patchDoc)
    {
        if (patchDoc == null) return BadRequest();

        var proveedorDB = await _context.proveedores.FirstOrDefaultAsync(p => p.Id == id);
        if (proveedorDB == null) return NotFound();

        var proveedorDTO = _mapper.Map<ProveedorPatchDto>(proveedorDB);

        patchDoc.ApplyTo(proveedorDTO, ModelState);

        var esValido = TryValidateModel(proveedorDTO);
        if (!esValido) return BadRequest(ModelState);

        _mapper.Map(proveedorDTO, proveedorDB);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/proveedor/5
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        var existe = await _context.proveedores.AnyAsync(p => p.Id == id);
        if (!existe) return NotFound();

        _context.Remove(new Proveedor { Id = id });
        await _context.SaveChangesAsync();
        return NoContent();
    }
    [HttpGet("{nombre}/productos")]
    public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductosDeProveedor(string nombre)
    {
        if (string.IsNullOrWhiteSpace(nombre))
            return BadRequest("Debes proporcionar al menos una parte del nombre del proveedor.");

        var proveedores = await _context.proveedores
            .Where(p => p.Nombre.ToLower().StartsWith(nombre.ToLower()))
            .Include(p => p.Productos)
                .ThenInclude(prod => prod.Categoria)
            .ToListAsync();

        if (!proveedores.Any())
            return NotFound("No se encontraron proveedores con ese nombre.");

        // Si quieres devolver todos los productos de todos los proveedores que coincidan:
      var productosDto = _mapper.Map<List<ProductoResumenDto>>(
          proveedores.SelectMany(p => p.Productos).ToList());    

        return Ok(productosDto);
    }

    [HttpGet("proveedores/categoria/{categoriaNombre}")]
    public async Task<ActionResult<IEnumerable<ProveedorSimpleDto>>> GetProveedoresPorCategoria(string categoriaNombre)
    {
        var proveedores = await _context.proveedores
            .Where(p => p.ProveedorCategorias.Any(pc => pc.Categoria.Nombre == categoriaNombre))
            .Select(p => new ProveedorSimpleDto
            {
                Nombre = p.Nombre,
                Telefono = p.Telefono,
                Direccion = p.Direccion
                
            })
            .ToListAsync();

        return Ok(proveedores);
    }
    [HttpGet("proveedores")]
    public async Task<ActionResult<IEnumerable<object>>> GetProveedores()
    {
        var proveedores = await _context.proveedores
            .Select(p => new
            {
                p.Id,
                p.Nombre
            })
            .ToListAsync();

        return Ok(proveedores);
    }
    [HttpGet("proveedores-con-productos")]
    public async Task<ActionResult> GetProveedoresConProductos()
    {
        var resultado = await _context.proveedores
            .Select(p => new
            {
                p.Id,
                p.Nombre,
                Productos = p.Productos.Select(prod => new
                {
                    prod.Id,
                    prod.Name,
                    prod.Price
                }).ToList()
            })
            .ToListAsync();

        return Ok(resultado);
    }






}
