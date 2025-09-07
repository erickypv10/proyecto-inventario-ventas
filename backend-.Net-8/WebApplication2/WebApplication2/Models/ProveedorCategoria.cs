namespace WebApplication2.Models
{
    public class ProveedorCategoria
    {
        public int ProveedorId { get; set; }
        public Proveedor Proveedor { get; set; }

        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; }
    }
}
