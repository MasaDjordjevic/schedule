using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Models;
using Microsoft.EntityFrameworkCore;
using Server.Services;

namespace Server
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {           
            services.AddSingleton<AssistantService, AssistantService>();
            services.AddSingleton<ClassroomService, ClassroomService>();
            services.AddSingleton<CourseService, CourseService>();
            services.AddSingleton<DepartmentService, DepartmentService>();
            services.AddSingleton<DivisionService, DivisionService>();
            services.AddSingleton<GroupService, GroupService>();
            services.AddSingleton<LoginService, LoginService>();
            services.AddSingleton<ScheduleService, ScheduleService>();
            services.AddSingleton<StudentService, StudentService>();


            // Add framework services.
            services.AddMvcCore().AddJsonFormatters();
            services.AddCors();

            // Adds a default in-memory implementation of IDistributedCache.
            services.AddDistributedMemoryCache();

            services.AddSession(options =>
            {
                options.CookieName = ".AdventureWorks.Session";
                options.IdleTimeout = System.TimeSpan.FromSeconds(10);
            });


            var connection = @"Server=MASA;Database=Raspored;Trusted_Connection=True;";
            services.AddDbContext<RasporedContext>(options => options.UseSqlServer(connection));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseSession();

            app.UseCors(builder => builder.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
        );

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseMvc();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

        }
    }
}
