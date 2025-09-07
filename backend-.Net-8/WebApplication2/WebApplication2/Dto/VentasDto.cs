namespace WebApplication2.Dto
{
    public class VentasDto
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public ClienteDto Cliente { get; set; } // Incluir datos del cliente
        public int ProductoId { get; set; }
        public string ProductoNombre { get; set; } // opcional
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Total { get; set; }
        
        public DateTime FechaVenta { get; set; }
    }
}
