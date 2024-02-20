using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FinancePersonal.Core.Entities;

namespace FinancePersonal.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Expenses)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<Category>()
                .HasMany(e => e.Expenses)
                .WithOne(e => e.Category)
                .HasForeignKey(e => e.CategoryId);
        }

    }
}
