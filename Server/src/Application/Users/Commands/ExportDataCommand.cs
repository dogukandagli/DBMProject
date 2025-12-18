using System.IO.Compression;
using System.Reflection;
using System.Text;
using Application.Posts.Interfaces;
using Application.Posts.Queries.GetUserPosts.Specifications;
using Application.Services;
using Application.Users.Interfaces;
using MediatR;
using TS.Result;

// ✅ Alias'lar
using AuthUserDto = Application.Auth.UserDto;
using UserPostDto = Application.Posts.Queries.GetUserPosts.UserPostDto;

namespace Application.Users.Commands;

public sealed record ExportMyDataCommand(
    bool ProfileInfo,
    bool Posts,
    bool Comments,
    bool Reactions,
    bool Memberships
) : IRequest<Result<ExportMyDataCommandResponse>>;

public sealed record ExportMyDataCommandResponse
{
    public byte[] Content { get; init; } = Array.Empty<byte>();
    public string ContentType { get; init; } = "application/zip";
    public string FileName { get; init; } = "my-data.zip";
}

internal sealed class ExportMyDataCommandHandler(
    IClaimContext claimContext,
    IUserReadService userReadService,
    IPostReadService postReadService
) : IRequestHandler<ExportMyDataCommand, Result<ExportMyDataCommandResponse>>
{
    public async Task<Result<ExportMyDataCommandResponse>> Handle(
        ExportMyDataCommand request,
        CancellationToken cancellationToken)
    {
        if (!(request.ProfileInfo || request.Posts || request.Comments || request.Reactions || request.Memberships))
            return Result<ExportMyDataCommandResponse>.Failure("En az bir seçenek seçmelisin.");

        Guid userId = claimContext.GetUserId();
        int viewerNeighborhoodId = claimContext.GetNeighborhoodId();

        AuthUserDto? user = await userReadService.GetUserDtoAsync(userId, cancellationToken);
        if (user is null)
            return Result<ExportMyDataCommandResponse>.Failure("Kullanıcı bulunamadı.");

        List<UserPostDto> posts = new();

        if (request.Posts)
        {
            var spec = new UserPostsSpecification(
                targetUserId: userId,
                isOwner: true,
                viewerNeighborhoodId: viewerNeighborhoodId);

            posts = await postReadService.GetUserPostsAsync(spec, userId, cancellationToken);
        }

        byte[] zipBytes = BuildZip(user, posts, request);

        return new ExportMyDataCommandResponse
        {
            Content = zipBytes,
            ContentType = "application/zip",
            FileName = "my-data.zip"
        };
    }

    private static byte[] BuildZip(AuthUserDto user, List<UserPostDto> posts, ExportMyDataCommand request)
    {
        static string Csv(string? x)
        {
            if (string.IsNullOrEmpty(x)) return "";
            var clean = x.Replace("\"", "\"\"").Replace("\r", " ").Replace("\n", " ");
            return $"\"{clean}\"";
        }

        static object? GetProp(object obj, params string[] names)
        {
            var t = obj.GetType();
            foreach (var n in names)
            {
                var p = t.GetProperty(n, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
                if (p != null) return p.GetValue(obj);
            }
            return null;
        }

        static string S(object? v)
        {
            if (v is null) return "";
            return v switch
            {
                DateTime dt => dt.ToString("yyyy-MM-dd HH:mm"),
                DateTimeOffset dto => dto.ToString("yyyy-MM-dd HH:mm"),
                bool b => b ? "Evet" : "Hayır",
                Enum e => e.ToString(),
                _ => v.ToString() ?? ""
            };
        }

        using var ms = new MemoryStream();
        using (var zip = new ZipArchive(ms, ZipArchiveMode.Create, leaveOpen: true))
        {
            if (request.ProfileInfo)
            {
                var entry = zip.CreateEntry("profil_bilgileri.csv");
                using var s = entry.Open();
                using var w = new StreamWriter(s, Encoding.UTF8);

                // ✅ verify + url alanları ÇIKTI
                w.WriteLine("Ad,Soyad,Email,TamAd,Sehir,Ilce,Mahalle,Biyografi");

                w.WriteLine(
                    $"{Csv(user.FirstName)}," +
                    $"{Csv(user.LastName)}," +
                    $"{Csv(user.Email)}," +
                    $"{Csv(user.FullName)}," +
                    $"{Csv(user.City)}," +
                    $"{Csv(user.District)}," +
                    $"{Csv(user.Neighborhood)}," +
                    $"{Csv(user.Biography)}"
                );
            }


            if (request.Posts)
            {
                var entry = zip.CreateEntry("gonderilerim.csv");
                using var s = entry.Open();
                using var w = new StreamWriter(s, Encoding.UTF8);

                w.WriteLine("Icerik,Gorunurluk,MedyaSayisi,Tarih");

                foreach (var p in posts)
                {
                    var content = GetProp(p, "Content", "Text", "Body", "Message", "Description");
                    var visibility = GetProp(p, "PostVisibilty", "Visibility", "Visibilty", "PostVisibility");
                    var medias = GetProp(p, "Medias", "Media", "MediaItems", "Attachments");
                    var createdAt = GetProp(p, "CreatedAt", "CreatedOn", "Date", "CreatedDate", "PublishDate");

                    int mediaCount = 0;
                    if (medias is System.Collections.ICollection col) mediaCount = col.Count;

                    w.WriteLine(
                        $"{Csv(S(content))}," +
                        $"{Csv(S(visibility))}," +
                        $"{mediaCount}," +
                        $"{Csv(S(createdAt))}"
                    );
                }
            }


            if (request.Comments) AddEmptyCsv(zip, "yorumlarim.csv", "Icerik,Tarih");
            if (request.Reactions) AddEmptyCsv(zip, "tepkilerim.csv", "Tur,Tarih");
            if (request.Memberships) AddEmptyCsv(zip, "uyeliklerim.csv", "KatilimTarihi,Rol");
        }

        return ms.ToArray();
    }

    private static void AddEmptyCsv(ZipArchive zip, string fileName, string header)
    {
        var entry = zip.CreateEntry(fileName);
        using var s = entry.Open();
        using var w = new StreamWriter(s, Encoding.UTF8);
        w.WriteLine(header);
    }
}
