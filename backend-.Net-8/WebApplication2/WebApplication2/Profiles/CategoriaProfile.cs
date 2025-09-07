using AutoMapper;
using WebApplication2.Dto;
using WebApplication2.Models;

namespace WebApplication2.Profiles
{
    public class CategoriaProfile : Profile
    {
        public CategoriaProfile()
        {
            CreateMap<Categoria, CategoriaDto>();
            CreateMap<CategoriaCreateUpdateDto, Categoria>();
        }
    }
}
