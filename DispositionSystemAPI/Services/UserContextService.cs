using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace DispositionSystemAPI.Services
{

    public interface IUserContextService
    {
        ClaimsPrincipal User { get; }
        int? GetUserId { get; }
    }


    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
        }

        public ClaimsPrincipal User => httpContextAccessor.HttpContext?.User; // user istnieje dla zapytań które posiadają atrybut autoryzacji.
                                                                              // Unikamy wystąpienia wyjątku jeśli pole User nie będzie posiadało nagłówka autoryzacji

        public int? GetUserId => User is null ? null : (int?)int.Parse(User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier).Value);

    }
}
