using Domain.Abstractions;
using Domain.Users.ValueObjects;

namespace Domain.Shared.EmailTemplate;

public sealed class TwoFactorAuthTemplate : IEmailTemplate
{
    private readonly string twoFactorCode;
    private readonly FullName fullname;
    public TwoFactorAuthTemplate(string twoFactorCode, FullName fullname)
    {
        this.twoFactorCode = twoFactorCode;
        this.fullname = fullname;
    }

    public string GetSubject() => "İki Faktörlü Doğrulama Kodu";


    public string GetBody()
    {
        return $@"Merhaba {fullname.Value} , Doğrulama Kodunuz : {twoFactorCode}";
    }
}
