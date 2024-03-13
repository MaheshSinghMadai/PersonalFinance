using FinancePersonal.Core.Entities.Identity;
using FinancePersonal.Core.Interface;
using FinancePersonal.Infrastructure.Data;
using FinancePersonal.Infrastructure.Data.Identity;
using FinancePersonal.Infrastructure.Services;
using FinancePersonal.Server.GoogleAuth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

//for identity db context
builder.Services.AddDbContext<AppIdentityDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
                      });
});

//builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    // Identity options here
})
    .AddEntityFrameworkStores<AppIdentityDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AppIdentityServices(builder.Configuration);

builder.Services.AddAuthentication().AddGoogle(options =>
{
    options.ClientId = "201032301966 - bko3u9e1250n934fclh6rjqfefhc11l4.apps.googleusercontent.com";
    options.ClientSecret = "GOCSPX - FQbvJySfU70fQrWkD8UKxcd7YcVK";
});

builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
builder.Services.Configure<GoogleAuthConfig>(builder.Configuration.GetSection("Google"));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseCors(MyAllowSpecificOrigins);
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

//using var scope = app.Services.CreateScope();
//var services = scope.ServiceProvider;
//var loggerFactory = services.GetRequiredService<ILoggerFactory>();
//try
//{
//    // Seeding identity data to identity database
//    var userManager = services.GetRequiredService<UserManager<AppUser>>();
//    var identityContext = services.GetRequiredService<AppIdentityDbContext>();
//    await identityContext.Database.MigrateAsync();
//    await AppIdentityDbContextSeed.SeedUserAsync(userManager);
//}
//catch (Exception ex)
//{
//    var logger = loggerFactory.CreateLogger<Program>();
//    logger.LogError(ex, "An error occurred seeding the DB.");
//}

app.Run();
