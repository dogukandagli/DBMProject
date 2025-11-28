using Domain.Neighborhoods;
using FluentValidation;
using MediatR;
using TS.Result;

namespace Application.Locations;

public sealed record CheckAddressExistsQuery(
    string City,
    string District,
    string Neighborhood,
    string StreetAddress
    ) : IRequest<Result<CheckAddressExistsResponse>>;

public sealed class CheckAddressExistsQueryValidator : AbstractValidator<CheckAddressExistsQuery>
{
    public CheckAddressExistsQueryValidator()
    {
        RuleFor(x => x.City)
            .NotEmpty().WithMessage("Şehir bilgisi zorunludur.")
            .MaximumLength(100).WithMessage("Şehir adı 100 karakterden uzun olamaz.");

        RuleFor(x => x.District)
            .NotEmpty().WithMessage("İlçe bilgisi zorunludur.")
            .MaximumLength(100).WithMessage("İlçe adı 100 karakterden uzun olamaz.");

        RuleFor(x => x.Neighborhood)
            .NotEmpty().WithMessage("Mahalle bilgisi zorunludur.")
            .MaximumLength(150).WithMessage("Mahalle adı 150 karakterden uzun olamaz.");

        RuleFor(x => x.StreetAddress)
            .NotEmpty().WithMessage("Sokak/Adres bilgisi boş olamaz.")
            .MaximumLength(150).WithMessage("Sokak/Adres bilgisi en fazla 150 karakter olabilir.");
    }
}

public sealed record CheckAddressExistsResponse(int? NeighborhoodId,
    bool Exists);

internal sealed class CheckAddressExistsQueryHandler(
    INeighborhoodRepository neighborhoodRepository,
    IDistrictRepostiory districtRepostiory,
    ICityRepostiory cityRepostiory) : IRequestHandler<CheckAddressExistsQuery, Result<CheckAddressExistsResponse>>
{
    public async Task<Result<CheckAddressExistsResponse>> Handle(CheckAddressExistsQuery request, CancellationToken cancellationToken)
    {
        var query = from n in neighborhoodRepository.GetAll()
                    join d in districtRepostiory.GetAll() on n.DistrictId equals d.Id
                    join c in cityRepostiory.GetAll() on d.CityId equals c.Id
                    where c.Name == request.City
                        && d.Name == request.District
                        && n.Name == request.Neighborhood
                    select n;

        Neighborhood? neighborhood = query.FirstOrDefault();

        if (neighborhood == null)
        {
            return new CheckAddressExistsResponse(NeighborhoodId: null,
                                                       Exists: false
                                                   );
        }

        int neighborhoodId = neighborhood.Id;

        CheckAddressExistsResponse checkAddressExistsResponse = new(neighborhoodId, true);

        return checkAddressExistsResponse;

    }
}