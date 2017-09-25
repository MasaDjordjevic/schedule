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

using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using CSAuthorAngular2InASPNetCore.Auth;

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
            services.AddTransient<AssistantService, AssistantService>();
            services.AddTransient<ClassroomService, ClassroomService>();
            services.AddTransient<CourseService, CourseService>();
            services.AddTransient<DepartmentService, DepartmentService>();
            services.AddTransient<DivisionService, DivisionService>();
            services.AddTransient<GroupService, GroupService>();
            services.AddTransient<LoginService, LoginService>();
            services.AddTransient<ScheduleService, ScheduleService>();
            services.AddTransient<StudentService, StudentService>();

            services.AddApplicationInsightsTelemetry(Configuration);

            services.AddAuthorization(auth =>
            {
                auth.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser().Build());
            });


            // Add framework services.
            services.AddCors();

            services.AddMvc()
                .AddJsonOptions(
                options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);         


            var connection = @"Server=tcp:schedule-server.database.windows.net,1433;Initial Catalog=Schedule;Persist Security Info=False;User ID=masaAdmin;Password=Plavusha3.,!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
            services.AddDbContext<RasporedContext>(options => options.UseSqlServer(connection));

            // Adds a default in-memory implementation of IDistributedCache.
            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.CookieName = ".Schedule.Session";
                options.IdleTimeout = System.TimeSpan.FromMinutes(120);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseApplicationInsightsRequestTelemetry();

            app.UseApplicationInsightsExceptionTelemetry();

            #region static files
            app.UseStaticFiles();
            #endregion

            #region UseJwtBearerAuthentication
            app.UseJwtBearerAuthentication(new JwtBearerOptions()
            {
                TokenValidationParameters = new TokenValidationParameters()
                {
                    IssuerSigningKey = TokenAuthOption.Key,
                    ValidAudience = TokenAuthOption.Audience,
                    ValidIssuer = TokenAuthOption.Issuer,
                    // When receiving a token, check that we've signed it.
                    ValidateIssuerSigningKey = true,
                    // When receiving a token, check that it is still valid.
                    ValidateLifetime = true,
                    // This defines the maximum allowable clock skew - i.e. provides a tolerance on the token expiry time 
                    // when validating the lifetime. As we're creating the tokens locally and validating them on the same 
                    // machines which should have synchronised time, this can be set to zero. Where external tokens are
                    // used, some leeway here could be useful.
                    ClockSkew = System.TimeSpan.FromMinutes(10)
                }
            });
            #endregion

            app.UseCors(builder => builder.WithOrigins("http://localhost:4200", "https://masadjordjevic.github.io")
                .AllowAnyHeader()
                 .AllowAnyHeader()
                 .AllowAnyMethod()
                  .AllowCredentials());

            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseSession();

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
