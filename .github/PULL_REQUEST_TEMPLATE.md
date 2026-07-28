## Summary

<!-- 1–3 cümle: ne değişti ve neden -->

## Değişiklikler

- [ ] Yeni migration var mı? → Evet ise migration adını / etkisini yaz
- [ ] Yeni env variable gerekiyor mu? → Evet ise `.env.example` güncellendi
- [ ] Breaking API change var mı? → **Yasak** (deprecate + bildirim); varsa frontend + mobil ekibe yaz
- [ ] Mobil uyumluluk: endpoint silindi veya response şekli değişti mi? → deprecate / Swagger notu
- [ ] Yeni npm paketi eklendi mi? → Evet ise `pnpm install` gerekli

## Test

- [ ] Unit / ilgili test eklendi veya güncellendi (gerekliyse)
- [ ] Local’de doğrulandı (`pnpm dev:apps` / ilgili smoke)
- [ ] Staging’de test edildi (varsa)
- [ ] Mobil ekip etkileniyor mu? → Evet ise Swagger / API notu güncellendi

## Notlar

<!-- Migration komutu, env adı, risk, rollback — varsa -->

---

Commit mesajları: Conventional Commits (`feat|fix|chore|docs|…(scope): …`) — husky + commitlint enforce eder.
