# Backend kurulum sırası

> Şema: `DATABASE_SCHEMA.md` · Hikâye: `DATABASE_FILL_STORIES.md`

**İsim:** `Agency` / `AgencyStaff` — Partner yok. Hold **10 dk**.

| Faz | İş                                                                                                                            |
| --- | ----------------------------------------------------------------------------------------------------------------------------- |
| 0   | Şema kilidi OK                                                                                                                |
| 1   | Identity: Agency+OWNER staff, DROP legacy B2B Agency/SubUser, Guide TUREB, Vehicle, Availability · **partial unique** migrate |
| 2   | Tour + TourExtra + Pickup boarding + Hotel/Accommodation · VKN gate PUBLISHED                                                 |
| 3   | Hold 10dk + Guest + ReservationExtra (quantity) + Payment CARD + **Invoice** (buyer+seller snapshot)                          |
| 4   | TourDateAssignment + ACCEPTED→çok gün `isAvailable=false` + paneller                                                          |
| 5   | Koltuk N+1 SeatAssignment AUTO_FIFO                                                                                           |
| 6   | Review Outbox TourMetrics RelatedTours                                                                                        |
| 7   | AgencyCommissionRate Earning Payout                                                                                           |
| 8   | Notification email/SMS Favorite Coupon SearchQueryLog                                                                         |

**Sonraki:** `Faz 1 başla` → Prisma identity migrate.
