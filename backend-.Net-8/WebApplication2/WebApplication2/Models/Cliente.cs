namespace WebApplication2.Models
{
    public class Cliente
    {
      
            public int Id { get; set; }

            // Información básica
            public string Nombre { get; set; }
            public string Telefono { get; set; }
            // Dirección
            public string Direccion { get; set; }
            // Relación con ventas
            public ICollection<Venta> Ventas { get; set; }

        }

    }

