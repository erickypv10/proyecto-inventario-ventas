using AutoMapper;
using WebApplication2.Dto;
using WebApplication2.Models;

public class VentaProfile : Profile
{
    public VentaProfile()
    {
        // Venta → VentaDto
        CreateMap<Venta, VentasDto>()
            .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto.Name))
            .ForMember(dest => dest.Cliente, opt => opt.MapFrom(src => src.Cliente));

        // VentaCreateUpdateDto → Venta
        CreateMap<VentasCreateUpdateDto, Venta>();

        // Venta → VentaCreateUpdateDto (para PATCH y PUT)
        CreateMap<Venta, VentasCreateUpdateDto>();
    }
}
