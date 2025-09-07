using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;
using WebApplication2.Data;
using WebApplication2.Dto;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ProductoController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/producto
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProducts()
        {
            var productos = await _context.productos
                .Include(p => p.Categoria)
                .Include(p => p.Proveedor)
                .ToListAsync();

            var productosDto = _mapper.Map<List<ProductoDto>>(productos);
            return Ok(productosDto);
        }


        // POST: api/producto
        [HttpPost]
        public async Task<IActionResult> PostProducto([FromBody] ProductoCreateUpdateDto productoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validar que la categoría exista
            var categoriaExists = await _context.categorias.AnyAsync(c => c.Id == productoDto.CategoriaId);
            if (!categoriaExists)
                return BadRequest($"La categoría con ID {productoDto.CategoriaId} no existe.");

            // Validar que el proveedor exista
            var proveedorExists = await _context.proveedores.AnyAsync(p => p.Id == productoDto.ProveedorId);
            if (!proveedorExists)
                return BadRequest($"El proveedor con ID {productoDto.ProveedorId} no existe.");

            // Mapear y guardar
            var producto = _mapper.Map<Producto>(productoDto);
            _context.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById), new { id = producto.Id }, producto);
        }

        // PUT: api/producto/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateProducto(int id, ProductoCreateUpdateDto productoDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var productoExistente = await _context.productos.FindAsync(id);
            if (productoExistente == null)
                return NotFound();

            _mapper.Map(productoDTO, productoExistente);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/producto/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.productos.FindAsync(id);
            if (producto == null)
                return NotFound();

            _context.productos.Remove(producto);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH: api/producto/{id}
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> PatchProducto(int id, [FromBody] JsonPatchDocument<ProductoCreateUpdateDto> patchDoc)
        {
            if (patchDoc == null)
                return BadRequest("No se envió ninguna operación de patch.");

            var producto = await _context.productos.FindAsync(id);
            if (producto == null)
                return NotFound("El producto no existe.");

            var productoDto = _mapper.Map<ProductoCreateUpdateDto>(producto);

            patchDoc.ApplyTo(productoDto, ModelState);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            TryValidateModel(productoDto);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _mapper.Map(productoDto, producto);

            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("categoria/{nombreCategoria}")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductosPorCategoria(string nombreCategoria)
        {
            if (string.IsNullOrWhiteSpace(nombreCategoria))
                return BadRequest("El nombre de la categoría es obligatorio.");

            var categoria = await _context.categorias
                .FirstOrDefaultAsync(c => c.Nombre.ToLower() == nombreCategoria.ToLower());

            if (categoria == null)
                return NotFound($"No existe la categoría '{nombreCategoria}'.");

            var productos = await _context.productos
                .Where(p => p.CategoriaId == categoria.Id)
                .Include(p => p.Categoria)
                .ToListAsync();

            if (!productos.Any())
                return NotFound($"No hay productos en la categoría '{nombreCategoria}'.");

            return Ok(_mapper.Map<IEnumerable<ProductoDto>>(productos));
        }
        [HttpGet("productos-sin-categoria")]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductosSinCategoria()
        {
            var productosSinCategoria = await _context.productos
                .Where(p => p.CategoriaId == 0) // Solo si tu FK es int
                .ToListAsync();

            if (!productosSinCategoria.Any())
                return NotFound("No hay productos sin categoría.");

            return Ok(productosSinCategoria);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDto>> GetProductById(int id)
        {
            var producto = await _context.productos
                .Include(p => p.Categoria)
                .Include(p => p.Proveedor)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (producto == null)
                return NotFound();

            var productoDto = _mapper.Map<ProductoDto>(producto);
            return Ok(productoDto);
        }




    }
}
