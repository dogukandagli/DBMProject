using Domain.Abstractions;

namespace Domain.Shared.EmailTemplate;

public sealed class EmailConfirmationTemplate : IEmailTemplate
{
    private readonly string _confirmationLink;
    private readonly string _userName;
    public EmailConfirmationTemplate(string confirmationLink, string userName)
    {
        _confirmationLink = confirmationLink;
        _userName = userName;
    }

    public string GetSubject() => "E-posta Adresinizi Doğrulayın";

    public string GetBody()
    {
        return $@"
            <!DOCTYPE html>
            <html lang='tr'>
            <head>
              <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
              <meta name='viewport' content='width=device-width, initial-scale=1.0' />
              <title>E-posta Doğrulama</title>
            </head>
            <body style='margin:0;padding:0;background-color:#f9f9f9;font-family:Segoe UI, Arial, sans-serif;color:#333;'>
              <table role='presentation' cellspacing='0' cellpadding='0' border='0' width='100%' style='background-color:#f9f9f9;padding:24px 0;'>
                <tr>
                  <td align='center'>
                    <table role='presentation' cellspacing='0' cellpadding='0' border='0' width='600' style='max-width:600px;width:100%;background:#ffffff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);'>
                      <tr>
                        <td style='padding:30px;'>
                          <h2 style='margin:0 0 16px 0;color:#2c3e50;font-weight:600;font-size:22px;'>Merhaba {_userName},</h2>
                          <p style='margin:0 0 12px 0;line-height:1.6;'>
                            Hesabınızı aktifleştirmek için e-posta adresinizi doğrulamanız gerekiyor.
                          </p>
                          <p style='margin:0 0 20px 0;line-height:1.6;'>
                            Aşağıdaki butona tıklayarak e-posta adresinizi doğrulayabilirsiniz:
                          </p>

                          <!-- Button -->
                          <table role='presentation' cellspacing='0' cellpadding='0' border='0' style='margin:0 0 20px 0;'>
                            <tr>
                              <td align='center' bgcolor='#007bff' style='border-radius:5px;'>
                                <a href='{_confirmationLink}'
                                   style='display:inline-block;padding:12px 20px;text-decoration:none;color:#ffffff;font-weight:600;border-radius:5px;'>
                                  E-posta Adresimi Doğrula
                                </a>
                              </td>
                            </tr>
                          </table>

                          <!-- Fallback link -->
                          <p style='margin:0 0 12px 0;font-size:13px;color:#666;line-height:1.6;'>
                            Buton çalışmazsa şu bağlantıyı tarayıcınıza yapıştırın:
                          </p>
                          <p style='margin:0 0 20px 0;word-break:break-all;font-size:13px;color:#007bff;'>
                            <a href='{_confirmationLink}' style='color:#007bff;text-decoration:underline;'>{_confirmationLink}</a>
                          </p>

                          <p style='margin:0 0 0 0;line-height:1.6;'>
                            Eğer bu isteği siz yapmadıysanız, bu e-postayı yok sayabilirsiniz.
                          </p>

                          <div style='margin-top:30px;font-size:12px;color:#888;'>
                            Teşekkürler,<br /><strong>Uygulamanız Ekibi</strong>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>";
    }
}
