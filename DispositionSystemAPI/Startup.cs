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

namespace DispositionSystemAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
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

            
            //services.AddScoped<IAuthorizationHandler, MinimumAgeRequirementHandler>(); // do kolekcji serwisów dla typu IAUthorizationHandler rejestrujemy klasê MinimumAgeRequirementHandler()
            services.AddScoped<IAuthorizationHandler, ResourceOperationRequirementHandler>();
            services.AddControllers().AddFluentValidation();
            services.AddDbContext<DepartmentDbContext>();
            services.AddScoped<DepartmentSeeder>();
            services.AddAutoMapper(this.GetType().Assembly);
            services.AddScoped<IDepartmentRepository, DepartmentRepository>();
            services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ErrorHandlingMiddleware>();
            services.AddScoped<RequestTimeMiddleware>();
            services.AddScoped<IValidator<RegisterUserDto>, RegisterUserDtoValidator>();
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            services.AddScoped<IUserContextService, UserContextService>();
            services.AddHttpContextAccessor();
            services.AddSwaggerGen();
            services.AddCors(options =>
            {
                options.AddPolicy("FrontEndClient", builder =>

                    builder.AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithOrigins(Configuration["AllowedOrigins"])
                    );
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DepartmentSeeder seeder)
        {

            app.UseResponseCaching();
            app.UseStaticFiles();   //serwowanie plików na serwerze       
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
            });

            //app.UseSpa(spa =>
            //{
            //    spa.Options.SourcePath = "ClientApp";

            //    if (env.IsDevelopment())
            //    {
            //        spa.UseReactDevelopmentServer(npmScript: "start");
            //    }
            //});
        }
    }
}
