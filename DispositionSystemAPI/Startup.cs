using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DispositionSystemAPI.Entities;
using DispositionSystemAPI.Services;
using DispositionSystemAPI.Middleware;
using Microsoft.AspNetCore.Identity;
using FluentValidation;
using DispositionSystemAPI.Models;
using DispositionSystemAPI.Models.Validators;
using FluentValidation.AspNetCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DispositionSystemAPI.Authorization;
using Microsoft.AspNetCore.Authorization;
using DispositionSystemAPI.Repository;
using Microsoft.Extensions.FileProviders;
using System.IO;
using DispositionSystemAPI.HubConfig;

namespace DispositionSystemAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var authenticationSettings = new AuthenticationSettings();
            Configuration.GetSection("Authentication").Bind(authenticationSettings);

            services.AddControllersWithViews();
            services.AddSingleton(authenticationSettings);



            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = "Bearer";
                option.DefaultScheme = "Bearer";
                option.DefaultChallengeScheme = "Bearer";
            }).AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = authenticationSettings.JwtIssuer,
                    ValidAudience = authenticationSettings.JwtIssuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSettings.JwtKey)),
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("AtLeast18", builder => builder.AddRequirements(new MinimumAgeRequirement(18)));

            });

            services.AddFluentValidation();
            services.AddDbContext<DepartmentDbContext>();
            services.AddScoped<DepartmentSeeder>();
            services.AddAutoMapper(this.GetType().Assembly);
            
            services.AddScoped<IDepartmentRepository, DepartmentRepository>();
            services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            services.AddScoped<IActionRepository, ActionRepository>();

            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ErrorHandlingMiddleware>();
            services.AddScoped<RequestTimeMiddleware>();
            services.AddScoped<IValidator<RegisterUserDto>, RegisterUserDtoValidator>();
            services.AddScoped<IValidator<EmployeeDto>, AddEmployeeDtoValidator>();
            services.AddScoped<IValidator<DepartmentDto>, AddDepartmentDtoValidator>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            services.AddHttpContextAccessor();
            services.AddSwaggerGen();
            
            services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
            });

            services.AddCors(options =>
            {
                var origins = Configuration["AllowedOrigins"].Split(";");
                options.AddPolicy("FrontEndClient", builder =>

                    builder.AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithOrigins(origins)
                        .AllowCredentials()
                    );
            });

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DepartmentSeeder seeder)
        {

            app.UseResponseCaching();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "PrivateFiles/Images")),
                RequestPath = "/api/PrivateFiles/Images"
            });     
            app.UseCors("FrontEndClient");
            seeder.Seed();
          
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

            }
            app.UseMiddleware<ErrorHandlingMiddleware>();
            app.UseMiddleware<RequestTimeMiddleware>();
            app.UseAuthentication();
            app.UseHttpsRedirection();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Department API");
            }
                
            );

            app.UseRouting();   
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<NotificationHub>("/notifications");
            });
        }
    }
}
