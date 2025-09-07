namespace WebApplication2.Models
{
    public class Proveedor
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }

         // Relación uno a muchos con Producto
        public ICollection<Producto> Productos { get; set; }
       
        public ICollection<ProveedorCategoria> ProveedorCategorias { get; set; } = new HashSet<ProveedorCategoria>();
    }
}
