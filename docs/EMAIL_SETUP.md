# E-posta kurulumu (OTP / transactional)

## Hedef (şirket maili açılana kadar)

| Alan                   | Değer                                   |
| ---------------------- | --------------------------------------- |
| **FROM (gönderen)**    | `learnedfromai@gmail.com`               |
| **TO (alıcı)**         | Kayıt olan kullanıcının girdiği e-posta |
| **Logo / buton linki** | https://turladur-zjyf.vercel.app        |

Resend, doğrulanmış domain olmadan **Gmail adresinden** rastgele kullanıcıya mail atamaz.  
Bu yüzden OTP için **Gmail SMTP + Uygulama Şifresi** kullanıyoruz.

## Kurulum (2 dk)

1. Google hesabı `learnedfromai@gmail.com` → [App passwords](https://myaccount.google.com/apppasswords)  
   (2FA açık olmalı) → “Mail” / “Other” → 16 haneli şifre üret
2. `apps/api/.env`:

```env
EMAIL_BRAND_URL=https://turladur-zjyf.vercel.app
MAIL_FROM="turta <learnedfromai@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=learnedfromai@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
OTP_SHOW_DEBUG_CODE=false
```

3. API restart: `pnpm --filter api start:dev`
4. `/register` → istediğin mail ile kayıt → OTP **o mailin gelen kutusuna** gelir, gönderen `learnedfromai@gmail.com` görünür

## Şirket domain sonrası

- Resend’de `turta.com` doğrula (SPF/DKIM)
- `MAIL_FROM=turta <noreply@turta.com>`
- `SMTP_USER` / `SMTP_PASS` kaldırılabilir; `RESEND_API_KEY` yeterli

## Local (Mailhog)

`SMTP_USER` / `SMTP_PASS` / `RESEND_API_KEY` boş → http://localhost:8025
