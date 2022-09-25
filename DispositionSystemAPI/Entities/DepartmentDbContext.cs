using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DispositionSystemAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace DispositionSystemAPI.Entities
{
    public class DepartmentDbContext : DbContext
    {
        private readonly string _connectionString = "Server=(localdb)\\mssqllocaldb;Database=DepartmentDb;Trusted_Connection=True;";

        public DbSet<Department> Departments { get; set; }

        public DbSet<DepartmentAddress> DepartmentAddresses { get; set; }

        public DbSet<EmployeeAddress> EmployeeAddresses { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<Action> Actions { get; set; }

        public DbSet<Notification> Notifications { get; set; }

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

            modelBuilder.Entity<DepartmentAddress>()
                .Property(a => a.City)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<DepartmentAddress>()
                .Property(a => a.Street)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<EmployeeAddress>()
               .Property(a => a.City)
               .IsRequired()
               .HasMaxLength(50);

            modelBuilder.Entity<EmployeeAddress>()
                .Property(a => a.Street)
                .IsRequired()
                .HasMaxLength(50);

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connectionString);
        }

    }
}
