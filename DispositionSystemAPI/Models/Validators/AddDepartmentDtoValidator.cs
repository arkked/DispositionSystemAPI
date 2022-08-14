using FluentValidation;

namespace DispositionSystemAPI.Models.Validators
{
    public class AddDepartmentDtoValidator : AbstractValidator<DepartmentDto>
    {
        public AddDepartmentDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name can not be empty"); 
            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(100)
                .WithMessage("Description can not be empty");

            RuleFor(x => x.Category)
                .MaximumLength(50)
                .NotEmpty()
                .WithMessage("Category can not be empty");

            RuleFor(x => x.ContactEmail)
                .NotEmpty()
                .EmailAddress()
                .WithMessage("Contact email can not be empty");

            RuleFor(x => x.ContactNumber)
                .NotEmpty()
                .MaximumLength(9)
                .WithMessage("Contact number can not be empty");

            RuleFor(x => x.City)
                .NotEmpty()
                .WithMessage("City name can not be empty");

            RuleFor(x => x.Street)
                .NotEmpty()
                .WithMessage("Street name can not be empty");

            RuleFor(x => x.PostalCode)
                .NotEmpty()
                .WithMessage("Postal code can not be empty");


        }
    }
}
