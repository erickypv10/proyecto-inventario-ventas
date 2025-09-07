using System.ComponentModel.DataAnnotations;

namespace WebApplication2.Dto
{
    public class ProveedorCreateDto
    {
        [Required]
        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public List<int> CategoriaIds { get; set; }
    }
}
