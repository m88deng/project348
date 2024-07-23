var builder = WebApplication.CreateBuilder(args);

// Add CORS services to the container
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin",
        builder => builder
            .WithOrigins("http://localhost:3000") 
            .AllowAnyHeader()
            .AllowCredentials());
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowMyOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();
