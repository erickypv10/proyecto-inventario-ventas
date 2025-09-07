namespace WebApplication2.Dto
{
    public class ProductoDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        public int CategoriaId { get; set; }
        public string CategoriaNombre { get; set; }

        public int ProveedorId { get; set; }
        public string ProveedorNombre { get; set; }
    }
}
