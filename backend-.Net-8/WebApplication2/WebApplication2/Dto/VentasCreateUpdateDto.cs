namespace WebApplication2.Dto
{
    public class VentasCreateUpdateDto
    {
        public int ClienteId { get; set; }
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Total { get; set; }
        public string MetodoPago { get; set; }
        public DateTime FechaVenta { get; set; } = DateTime.UtcNow;
    }
}
