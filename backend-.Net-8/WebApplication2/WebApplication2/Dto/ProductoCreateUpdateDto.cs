using System.ComponentModel.DataAnnotations;

namespace WebApplication2.Dto
{
    public class ProductoCreateUpdateDto
    {
        [Required]
        public string Name { get; set; }

        
        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; } = decimal.Zero;

        [Required]
        public int CategoriaId { get; set; }

        [Required]
        public int ProveedorId { get; set; }
        public int stock { get; set; }
       
    }
}
