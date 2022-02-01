using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DispositionSystemAPI.Entities;

namespace DispositionSystemAPI
{
    public class DepartmentSeeder
    {

        private readonly DepartmentDbContext _dbContext;

        public DepartmentSeeder(DepartmentDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Seed()
        {

            if (_dbContext.Database.CanConnect())
            {
                if (!_dbContext.Departments.Any())
                {
                    var departments = GetDepartments();
                    _dbContext.Departments.AddRange(departments);
                    _dbContext.SaveChanges();
                }
            
            }

        }

        private IEnumerable<Department> GetDepartments() 
        {
            var departments = new List<Department>()
            {
                new Department()
                {
                    Name = "OSP Lubliniec",
                    Category = "Volunteer Fire Department",
                    Description = "OSP Lubliniec is volunteer Fire Department which react to all smaller cases",
                    ContactEmail = "contact@OSPLubliniec.com",
                    ContactNumber = "(+48) 415 324 512",
                    Employees = new List<Employee>()
                    {
                        new Employee()
                        {
                            FirstName = "Jan",
                            LastName = "Kowalski",
                            Address = new Address()
                            {
                                City = "Lubliniec",
                                PostalCode = "42-700",
                                Street = "Moniuszki 42/134"
                            }
                        },

                        new Employee()
                        {
                            FirstName = "Adam",
                            LastName = "Nowak",
                            Address = new Address()
                            {
                                City = "Lubliniec",
                                PostalCode = "42-700",
                                Street = "Cmentarna 31"
                            }

                        },

                        new Employee()
                        {
                            FirstName = "Michał",
                            LastName = "Kołodziej",
                            Address = new Address()
                            {
                                City = "Lubliniec",
                                PostalCode = "42-700",
                                Street = "Chłopska 13"
                            }
                        }
                    },

                    Address = new Address()
                    {
                        City = "Lubliniec",
                        Street = "Kościuszki 31",
                        PostalCode = "42-700"
                    }
                },

                new Department()
                {
                    Name = "OSP Tarnowskie Góry",
                    Category = "Volunteer Fire Department",
                    Description = "OSP Lubliniec is volunteer Fire Department which react to all smaller cases",
                    ContactEmail = "contact@OSPTarnGory.com",
                    ContactNumber = "(+48) 321 412 123",
                    Employees = new List<Employee>()
                    {
                        new Employee()
                        {
                            FirstName = "Zbigniew",
                            LastName = "Maruszczyk",
                            Address = new Address()
                            {
                                City = "Tarnowskie Góry",
                                PostalCode = "42-600",
                                Street = "Krótka 6"
                            }
                        },

                        new Employee()
                        {
                            FirstName = "Łucjan",
                            LastName = "Szpak",
                            Address = new Address()
                            {
                                City = "Tarnowskie Góry",
                                PostalCode = "42-600",
                                Street = "Długa 41"
                            }

                        },

                        new Employee()
                        {
                            FirstName = "Kamil",
                            LastName = "Polak",
                            Address = new Address()
                            {
                                City = "Tarnowskie Góry",
                                PostalCode = "42-600",
                                Street = "Chłopska 13"
                            }
                        }
                    },

                    Address = new Address()
                    {
                        City = "Tarnowskie Góry",
                        Street = "Kościuszki 31",
                        PostalCode = "42-600"
                    }
                },

                new Department()
                {
                    Name = "PSP Częstochowa",
                    Category = "State Fire Department",
                    Description = "PSP Częstochowa is state Fire Department which react to all cases",
                    ContactEmail = "contact@PSPCZ.com",
                    ContactNumber = "(+48) 142 426 375",
                    Employees = new List<Employee>()
                    {
                        new Employee()
                        {
                            FirstName = "Łukasz",
                            LastName = "Brzoza",
                            Address = new Address()
                            {
                                City = "Częstochowa",
                                PostalCode = "42‑226",
                                Street = "Kolorowa 2"
                            }
                        },

                        new Employee()
                        {
                            FirstName = "Karol",
                            LastName = "Przybysz",
                            Address = new Address()
                            {
                                City = "Częstochowa",
                                PostalCode = "42‑226",
                                Street = "Zielona 31a"
                            }

                        },

                        new Employee()
                        {
                            FirstName = "Jan",
                            LastName = "Niemiec",
                            Address = new Address()
                            {
                                City = "Częstochowa",
                                PostalCode = "42‑226",
                                Street = "Korfantego 21"
                            }
                        }
                    },

                    Address = new Address()
                    {
                        City = "Częstochowa",
                        Street = "Główna 51",
                        PostalCode = "42‑226"
                    }
                }



            };

            return departments;

        }
    }
}
