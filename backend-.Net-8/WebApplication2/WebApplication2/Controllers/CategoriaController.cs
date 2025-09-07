using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication2.Data;
using WebApplication2.Dto;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CategoriaController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // POST
        [HttpPost]
        public async Task<IActionResult> PostCategoria(CategoriaCreateUpdateDto categoriaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var categoria = _mapper.Map<Categoria>(categoriaDto);
            _context.categorias.Add(categoria);
            await _context.SaveChangesAsync();
            return Ok(_mapper.Map<CategoriaDto>(categoria));
        }

        // GET todas las categorías con productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaDto>>> GetCategoriasSinProductos()
        {
            var categorias = await _context.categorias
                .AsNoTracking() // Opcional para mejor performance si no vas a modificar
                .ToListAsync();

            var categoriasDto = _mapper.Map<List<CategoriaDto>>(categorias);

            return Ok(categoriasDto);
        }


        // GET una categoría con sus productos
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CategoriaDto>> GetCategoria(int id)
        {
            var categoria = await _context.categorias
                .Include(c => c.Productos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (categoria == null)
                return NotFound("La categoría no existe.");

            var categoriaDto = _mapper.Map<CategoriaDto>(categoria);
            return Ok(categoriaDto);
        }


        // PUT (actualización completa)
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutCategoria(int id, CategoriaCreateUpdateDto categoriaDto)
        {
            var categoria = await _context.categorias.FindAsync(id);
            if (categoria == null)
                return NotFound("La categoría no existe.");

            _mapper.Map(categoriaDto, categoria);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH (actualización parcial)
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> PatchCategoria(int id, [FromBody] JsonPatchDocument<Categoria> patchDoc)
        {
            if (patchDoc == null)
                return BadRequest();

            var categoria = await _context.categorias.FindAsync(id);
            if (categoria == null)
                return NotFound("La categoría no existe.");

            patchDoc.ApplyTo(categoria, ModelState);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.categorias.FindAsync(id);
            if (categoria == null)
                return NotFound("La categoría no existe.");

            _context.categorias.Remove(categoria);
            await _context.SaveChangesAsync();
            return NoContent();
        }
     

    }
}
