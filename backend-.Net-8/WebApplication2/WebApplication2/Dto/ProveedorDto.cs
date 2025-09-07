namespace WebApplication2.Dto
{
    public class ProveedorDto
    {
  
        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public List<ProductoDto> Productos { get; set; }
    }
}
