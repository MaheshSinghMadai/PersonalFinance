using System;
using System.Collections.Generic;
using System.Linq;
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
        public DbSet<Income> Incomes { get; set; }
        public DbSet<Investment> Investments { get; set; }
        public DbSet<NepsePortfolio> NepsePortfolios { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Category>()
                .HasMany(e => e.Expenses)
                .WithOne(e => e.Category)
                .HasForeignKey(e => e.CategoryId);
        }
    }
}
