using AutoMapper;
using WebApplication2.Dto;
using WebApplication2.Models;

public class ProductoProfile : Profile
{
    public ProductoProfile()
    {
        CreateMap<Producto, ProductoDto>()
            .ForMember(dest => dest.CategoriaNombre, opt => opt.MapFrom(src => src.Categoria != null ? src.Categoria.Nombre : null))
            .ForMember(dest => dest.ProveedorNombre, opt => opt.MapFrom(src => src.Proveedor != null ? src.Proveedor.Nombre : null));

        CreateMap<ProductoDto, Producto>();

        // Aquí la línea que te falta:
        CreateMap<Producto, ProductoCreateUpdateDto>();
        CreateMap<ProductoCreateUpdateDto, Producto>();
        CreateMap<Producto, ProductoResumenDto>()
            .ForMember(dest => dest.Categoria, opt => opt.MapFrom(src => src.Categoria != null ? src.Categoria.Nombre : null))
            .ForMember(dest => dest.Proveedor, opt => opt.MapFrom(src => src.Proveedor != null ? src.Proveedor.Nombre : null));

    }
}
