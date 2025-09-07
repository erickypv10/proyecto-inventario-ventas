using AutoMapper;
using WebApplication2.Dto;
using WebApplication2.Models;



     public class ClienteProfile : Profile
       {
        public ClienteProfile()
        {
            // Cliente → ClienteDto
            CreateMap<Cliente, ClienteDto>();

            // ClienteCreateUpdateDto → Cliente
            CreateMap<ClienteCreateUpdateDto, Cliente>();

            // Cliente → ClienteCreateUpdateDto (para PATCH y PUT)
            CreateMap<Cliente, ClienteCreateUpdateDto>();
        }
       }


