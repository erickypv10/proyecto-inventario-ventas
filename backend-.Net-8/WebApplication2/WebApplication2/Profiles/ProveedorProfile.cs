using AutoMapper;
using WebApplication2.Dto;
using WebApplication2.Models;

namespace WebApplication2.Profiles
{
    public class ProveedorProfile : Profile
    {
        public ProveedorProfile()
        {
            CreateMap<Proveedor, ProveedorDto>();
            CreateMap<ProveedorCreateDto, Proveedor>()
                .ForMember(dest => dest.ProveedorCategorias,
                    opt => opt.MapFrom(src => src.CategoriaIds.Select(id => new ProveedorCategoria { CategoriaId = id })));

            CreateMap<Proveedor, ProveedorSimpleDto>();
            CreateMap<ProveedorSimpleDto, Proveedor>();

            
        }
    }
}
