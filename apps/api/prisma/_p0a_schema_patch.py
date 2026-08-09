#!/usr/bin/env python3
"""P0-A: transform prisma/schema.prisma — DROP Partner/LegacyAgency/SubUser."""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "../src/generated/prisma/schema.prisma"
DST = ROOT / "schema.prisma"

shutil.copyfile(SRC, DST)
text = DST.read_text()


def strip_enum(name: str) -> None:
    global text
    pattern = (
        r"(///[^\n]*\n)*enum "
        + re.escape(name)
        + r" \{.*?\n  @@schema\(\"identity\"\)\n\}\n\n"
    )
    match = re.search(pattern, text, re.S)
    if not match:
        raise SystemExit(f"enum {name} missing")
    text = text[: match.start()] + text[match.end() :]
    print("removed enum", name)


strip_enum("PartnerStatus")
strip_enum("PartnerCapability")
strip_enum("MembershipTier")

text2, count = re.subn(
    r"  /// PARTNER_STAFF[^\n]*\n"
    r"  permissions\s+Json\?\n"
    r"  partnerId\s+String\?\n"
    r"  partner\s+Partner\?\s+@relation\([^\n]+\n"
    r"  /// Legacy B2B[^\n]*\n"
    r"  legacyAgencies\s+LegacyAgency\[\]\n",
    "  /// Staff izinleri (AgencyStaff.permissions tercih edilir).\n"
    "  permissions       Json?\n",
    text,
    count=1,
)
if count != 1:
    raise SystemExit(f"User fields count={count}")
text = text2

text2, count = re.subn(
    r"  @@index\(\[partnerId\]\)\n  @@index\(\[role\]\)\n",
    "  @@index([role])\n",
    text,
    count=1,
)
if count != 1:
    raise SystemExit(f"User idx count={count}")
text = text2
print("User cleaned")

for pattern, label in [
    (r"\nmodel Partner \{.*?\n  @@schema\(\"identity\"\)\n\}\n", "Partner"),
    (
        r"\n/// Legacy B2B Agency status.*?\nmodel LegacyAgency \{.*?\n  @@schema\(\"identity\"\)\n\}\n",
        "LegacyAgency",
    ),
    (
        r"\n/// Partner alt kullanıcı.*?\nmodel SubUser \{.*?\n  @@schema\(\"identity\"\)\n\}\n",
        "SubUser",
    ),
]:
    match = re.search(pattern, text, re.S)
    if not match:
        raise SystemExit(f"{label} missing")
    text = text[: match.start()] + "\n" + text[match.end() :]
    print("removed", label)

text2, count = re.subn(
    r'  linkedPartner\s+Partner\?\s+@relation\("PartnerMarketplaceAgency"\)\n',
    "  experiences         Experience[]\n",
    text,
    count=1,
)
if count != 1:
    raise SystemExit(f"linkedPartner count={count}")
text = text2

text2, count = re.subn(
    r"  /// Expand: Partner hâlâ zorunlu[^\n]*\n"
    r"  partnerId\s+String\n"
    r"  partner\s+Partner\s+@relation\([^\n]+\n"
    r"  agencyId\s+String\?\n"
    r"  agency\s+Agency\?\s+@relation\([^\n]+\n",
    "  agencyId         String\n"
    "  agency           Agency       @relation(fields: [agencyId], references: [id])\n",
    text,
    count=1,
)
if count != 1:
    raise SystemExit(f"Tour ownership count={count}")
text = text2


def drop_index_in_model(model_name: str, index_line: str) -> None:
    global text
    match = re.search(
        rf'model {model_name} \{{.*?@@schema\("[^"]+"\)\n\}}', text, re.S
    )
    if not match:
        raise SystemExit(f"model {model_name}")
    block = match.group(0)
    if index_line not in block:
        print(f"warn: {index_line} not in {model_name}")
        return
    block2 = block.replace(index_line + "\n", "", 1)
    text = text[: match.start()] + block2 + text[match.end() :]


drop_index_in_model("Tour", "  @@index([partnerId])")

text2, count = re.subn(
    r"  /// Expand: Partner hâlâ var[^\n]*\n"
    r"  partnerId\s+String\n"
    r"  partner\s+Partner\s+@relation\([^\n]+\n"
    r"  agencyId\s+String\?\n"
    r"  agency\s+Agency\?\s+@relation\([^\n]+\n",
    "  /// Referans otel sahipliği (satış yok).\n"
    "  agencyId       String\n"
    "  agency         Agency    @relation(fields: [agencyId], references: [id])\n",
    text,
    count=1,
)
if count != 1:
    raise SystemExit(f"Hotel ownership count={count}")
text = text2
drop_index_in_model("Hotel", "  @@index([partnerId])")

text2, count = re.subn(
    r"  partnerId\s+String\n"
    r"  partner\s+Partner\s+@relation\([^\n]+\n"
    r"  dates\s+ActivityDate\[\]\n",
    "  agencyId            String\n"
    "  agency              Agency           @relation(fields: [agencyId], references: [id])\n"
    "  dates               ActivityDate[]\n",
    text,
    count=1,
)
if count != 1:
    raise SystemExit(f"Experience ownership count={count}")
text = text2

match = re.search(r'model Experience \{.*?@@schema\("catalog"\)\n\}', text, re.S)
if not match:
    raise SystemExit("Experience model")
block = match.group(0).replace("  @@index([partnerId])\n", "  @@index([agencyId])\n", 1)
text = text[: match.start()] + block + text[match.end() :]

text2, count = re.subn(
    r"  agencyId\s+String\?\n"
    r"  partnerId\s+String\n"
    r"  status\s+BookingStatus",
    "  agencyId               String\n"
    "  status                 BookingStatus",
    text,
    count=1,
)
if count != 1:
    raise SystemExit(f"Reservation ownership count={count}")
text = text2
drop_index_in_model("Reservation", "  @@index([partnerId])")
drop_index_in_model("Reservation", "  @@index([partnerId, status, createdAt])")

text2, count = re.subn(
    r"  /// Expand: Partner hâlâ yazılıyor[^\n]*\n"
    r"  partnerId\s+String\n"
    r"  agencyId\s+String\?\n",
    "  agencyId                String\n",
    text,
    count=1,
)
if count != 1:
    raise SystemExit(f"Review ownership count={count}")
text = text2
drop_index_in_model("Review", "  @@index([partnerId])")

text = text.replace(
    "// ─── identity: marketplace Agency (Faz 1 expand — Partner hâlâ durur) ───",
    "// ─── identity: marketplace Agency (P0-A hard contract) ───",
)

DST.write_text(text)

for pat in [
    "model Partner ",
    "model SubUser ",
    "model LegacyAgency ",
    "partnerId",
    "linkedPartner",
    "MembershipTier",
    "PartnerStatus",
    "PartnerCapability",
]:
    print(repr(pat), text.count(pat))
print("lines", len(text.splitlines()))
print("OK")
