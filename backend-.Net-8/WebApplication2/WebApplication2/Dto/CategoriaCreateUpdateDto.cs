using System.ComponentModel.DataAnnotations;
namespace WebApplication2.Dto
{
    public class CategoriaCreateUpdateDto
    {
        [Required(ErrorMessage = "El nombre de la categoría es obligatorio")]
        public string Nombre { get; set; }
    }
}
