using DispositionSystemAPI.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.IO;
using System.Threading.Tasks;

namespace DispositionSystemAPI.Controllers
{
    [Route("api/department/{departmentId}/employee/{employeeId}/files")]
    [Authorize]
    public class FileController : ControllerBase
    {
        private readonly IEmployeeRepository employeeRepository;

        public FileController(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }

        [HttpGet]
        [ResponseCache(Duration = 1200, VaryByQueryKeys = new[] {"fileName"})]
        public async Task<ActionResult> GetFile([FromQuery] string fileName)
        {
            var rootPath = Directory.GetCurrentDirectory();

            var filePath = $"{rootPath}/PrivateFiles/Images/{fileName}";

            var fileExists = System.IO.File.Exists(filePath);

            if (!fileExists)
            {
                return NotFound();
            }

            var contentProvider = new FileExtensionContentTypeProvider();

            contentProvider.TryGetContentType(filePath, out string contentType);

            var fileContents = await System.IO.File.ReadAllBytesAsync(filePath);

            return File(fileContents, contentType, fileName);
        }

        [HttpPost]
        [Route("upload-image")]
        public async Task<ActionResult> Upload([FromRoute] int departmentId, [FromRoute] int employeeId, IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                var rootPath = Directory.GetCurrentDirectory();
                var fileName = file.FileName;

                var fullPath = $"{rootPath}/PrivateFiles/Images/{fileName}";
                var apiPath = $"PrivateFiles/Images/{fileName}";

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);                   
                }

                if (await this.employeeRepository.UpdateProfileImage(departmentId, employeeId, apiPath))
                {
                    return Ok(apiPath);
                }

                return BadRequest();
            }

            return BadRequest();
        }
    }
}
