using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using WebApplication2.Models;
namespace WebApplication2.Data
{
    public class AppDbContext: DbContext

    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Producto>  productos { get; set; }
        public DbSet<Categoria> categorias { get; set; }
        public DbSet<Proveedor> proveedores { get; set; }
        public DbSet<Venta> ventas { get; set; }
        public DbSet<Cliente> clientes { get; set; }

        public DbSet<ProveedorCategoria> proveedorCategorias { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Producto>()
                .Property(p => p.Price)
                .HasColumnType("decimal(10, 2)");

            modelBuilder.Entity<Venta>()
                .Property(p => p.PrecioUnitario)
                .HasColumnType("decimal(10, 2)");

            modelBuilder.Entity<Venta>()
               .Property(p => p.Total)
               .HasColumnType("decimal(10, 2)");

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Categoria)
                .WithMany(c => c.Productos)
                .HasForeignKey(p => p.CategoriaId)
                .IsRequired();


            modelBuilder.Entity<Proveedor>()
                .HasMany(p => p.Productos)
                .WithOne(p => p.Proveedor)
                .HasForeignKey(p => p.ProveedorId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProveedorCategoria>()
                .HasKey(pc => new {pc.ProveedorId, pc.CategoriaId});

            modelBuilder.Entity<ProveedorCategoria>()
                .HasOne(pc => pc.Proveedor)
                .WithMany(p => p.ProveedorCategorias)
                .HasForeignKey(pc => pc.ProveedorId);

            modelBuilder.Entity<ProveedorCategoria>()
                .HasOne(pc => pc.Categoria)
                .WithMany(c => c.ProveedorCategorias)
                .HasForeignKey(pc => pc.CategoriaId);

            modelBuilder.Entity<Venta>()
                .HasOne(v => v.Cliente)       // Una venta tiene un cliente
                .WithMany(c => c.Ventas)      // Un cliente puede tener muchas ventas
                .HasForeignKey(v => v.ClienteId)
                .OnDelete(DeleteBehavior.Restrict); // evita borrar cliente con ventas

        }
    }
}
