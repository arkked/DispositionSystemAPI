using DispositionSystemAPI.Entities;
using FluentValidation;
using System.Linq;

namespace DispositionSystemAPI.Models.Validators
{
    public class DepartmentQueryValidator : AbstractValidator<DepartmentQuery>
    {

        private int[] allowedPageSizes = new[] { 5, 10, 15 };

        private string[] allowedSortByColumnNames = { nameof(Department.Name), nameof(Department.Category), nameof(Department.Description), };
        public DepartmentQueryValidator()
        {
            RuleFor(r => r.PageNumber).GreaterThanOrEqualTo(1);
            RuleFor(r => r.PageSize).Custom((value, context) =>
            {
                if (!allowedPageSizes.Contains(value))
                {
                    context.AddFailure("PageSize", $"PageSize must be in [{string.Join(",", allowedPageSizes)}]");
                }
            });

            RuleFor(r => r.SortBy)
                .Must(value => string.IsNullOrEmpty(value) || allowedSortByColumnNames.Contains(value))
                .WithMessage($"Sort by is optional, or must be in [{string.Join(",", allowedSortByColumnNames)}]");
        }

    }
}
