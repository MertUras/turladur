export function getOperatorDisplayName(
  companyName: string | null | undefined,
  email?: string,
) {
  return companyName || email || 'Tur Operatörü';
}

export function getOperatorAvatarUrl(name: string, logo?: string | null) {
  if (logo && !logo.startsWith('blob:')) return logo;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0EA5E9&color=fff`;
}
