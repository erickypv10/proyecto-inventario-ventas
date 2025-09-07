namespace WebApplication2.Models
{
    public class Venta
    {
       
            public int Id { get; set; }

            // Cliente de la venta
            public int ClienteId { get; set; }
            public Cliente Cliente { get; set; }

            // Producto vendido
            public int ProductoId { get; set; }
            public Producto Producto { get; set; }

            // Datos de la venta
            public int Cantidad { get; set; }
            public decimal PrecioUnitario { get; set; }
            public decimal Total { get; set; }
            public string MetodoPago { get; set; }

            public DateTime FechaVenta { get; set; } = DateTime.UtcNow;
        }


    }

