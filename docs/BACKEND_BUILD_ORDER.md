# Backend kurulum sırası

> Şema: `DATABASE_SCHEMA.md` · Hikâye: `DATABASE_FILL_STORIES.md` · **Kilidi:** `PHASE_0_SCHEMA_LOCK.md`  
> Ertelenenler: `bulgular.md` → **⬆ SONRA (P0-B sonrası)** en üstte

**UI redesign yok** — P0-B PartnerShell parity. Cloudflare / Neon onaysız yok.

| Faz     | İş                                                                     | Durum                   |
| ------- | ---------------------------------------------------------------------- | ----------------------- |
| 0       | Şema kilidi                                                            | **TAMAM**               |
| 1–7     | Identity → Commission                                                  | **LOCAL TAMAM** · Neon? |
| 8–11    | Notification → Auth middleware                                         | **LOCAL TAMAM** · Neon? |
| 12      | Partner→Agency **soft contract**                                       | **SUPERSEDED** (Faz 14) |
| 13      | AgencyStaff → partner panel bridge                                     | **LOCAL TAMAM** · Neon? |
| **14**  | **P0-A hard contract:** DROP Partner/LegacyAgency/SubUser · `agencyId` | **LOCAL TAMAM** · Neon? |
| **15**  | **P0-B panel cutover B1–B3:** `/acente` · `/rehber` · `/otobus`        | **LOCAL TAMAM** · Neon? |
| **15b** | **P0-B6 müsaitlik:** Guide + Vehicle day calendar                      | **LOCAL TAMAM** · Neon? |

**Faz 15 (P0-B) notları:**

- FE: `(agency)/acente/**` + `AgencyShell`; `/acente/giris` (eski `/partner-login` redirect)
- FE: `(guide)/rehber/**` + `GuideShell`; `(bus)/otobus/**` + `BusShell`
- Auth: `loginGuide` / `loginBusCompany` + session bootstrap
- Nest API path hâlâ `/api/v1/partner/*` (rename yok)
- **B6 (LOCAL TAMAM):** `GET/PUT identity/guides/me/availability` · `bus-companies/me/vehicles` + vehicle availability; FE takvim (missing=available; ACCEPTED lock)
- **B4–B5 (koltuk / atama) bu fazda yok** — bulgular aşama rehberi

**Sonraki:** P0-B4 koltuk · P0-B5 acente global inbox (otobüs) **veya** P0-C Neon (ayrı onay).
