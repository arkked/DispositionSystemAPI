using FluentValidation;

namespace DispositionSystemAPI.Models.Validators
{
    public class AddEmployeeDtoValidator : AbstractValidator<EmployeeDto>
    {

        public AddEmployeeDtoValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().WithMessage("First name can not be empty");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Last name can not be empty");
            RuleFor(x => x.City).NotEmpty().WithMessage("City name can not be empty");
            RuleFor(x => x.Street).NotEmpty().WithMessage("Street name can not be empty");
            RuleFor(x => x.PostalCode).NotEmpty().WithMessage("Postal code can not be empty");
        }
    }
}
