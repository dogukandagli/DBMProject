using Application.Common.Models;
using Application.Services;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.Lacations;

public sealed record AutoCompleteQuery(string Query, string SessionToken) : IRequest<Result<List<AutocompleteResult>>>;

public sealed class AutoCompleteQueryValidator : AbstractValidator<AutoCompleteQuery>
{
    public AutoCompleteQueryValidator()
    {
        RuleFor(x => x.Query)
            .NotEmpty()
            .WithMessage("Arama sorgusu boş olamaz")
            .MaximumLength(200)
            .WithMessage("Arama sorgusu en fazla 200 karakter olabilir")
            .MinimumLength(2)
            .WithMessage("Arama sorgusu en az 2 karakter olmalıdır");

        RuleFor(x => x.SessionToken)
        .NotEmpty()
        .Must(token => Guid.TryParse(token, out _))
        .WithMessage("Session token geçerli bir GUID formatında olmalıdır");
    }
}
internal sealed class AutoCompleteQueryHandler(IAutoCompleteService autoCompleteService) : IRequestHandler<AutoCompleteQuery, Result<List<AutocompleteResult>>>
{
    public async Task<Result<List<AutocompleteResult>>> Handle(AutoCompleteQuery request, CancellationToken cancellationToken)
    {
        var predictions = await autoCompleteService.GetAutocompletePredictionsAsync(request.Query, request.SessionToken);

        return predictions;
    }
}