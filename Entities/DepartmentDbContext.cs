using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DispositionSystemAPI.Entities
{
    public class DepartmentDbContext : DbContext
    {
        private string _connectionString = "Server=(localdb)\\mssqllocaldb;Database=DepartmentDb;Trusted_Connection=True;";

        public DbSet<Department> Departments { get; set; }

        public DbSet<Address> Addresses { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .IsRequired();

             modelBuilder.Entity<Role>()
                .Property(u => u.Name)
                .IsRequired();

            modelBuilder.Entity<Department>()
                .Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(25);

            modelBuilder.Entity<Employee>()
                .Property(e => e.FirstName)
                .IsRequired();

            modelBuilder.Entity<Employee>()
                .Property(e => e.LastName)
                .IsRequired();

            modelBuilder.Entity<Address>()
                .Property(a => a.City)
                .IsRequired()
                .HasMaxLength(50);
            
            modelBuilder.Entity<Address>()
                .Property(a => a.Street)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Employee>()
                .Property(p => p.AddressId)
                .IsRequired();

            
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connectionString);
        }

    }
}
