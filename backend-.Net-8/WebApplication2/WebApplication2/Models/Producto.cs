namespace WebApplication2.Models
{
    public class Producto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; } = decimal.Zero;
        public int stock { get; set; }
        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; }
        public int? ProveedorId { get; set; }   // FK opcional
        public Proveedor Proveedor { get; set; } // navegación
    }
}
