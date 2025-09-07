using System.ComponentModel.DataAnnotations;
namespace WebApplication2.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "El nombre de la categoría es obligatorio")]
        public string Nombre { get; set; }

        public ICollection<Producto> Productos { get; set; } = new HashSet<Producto>();
        public ICollection<ProveedorCategoria> ProveedorCategorias { get; set; } = new HashSet<ProveedorCategoria>();
    }
}