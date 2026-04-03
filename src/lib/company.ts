export const COMPANY_COOKIE_NAME = 'bizhub_selected_company';

export function buildCompanyUrl(baseUrl: string, companyId?: number): string {
  if (!companyId) return baseUrl;
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}companyId=${companyId}`;
}

export function getCompanyParams(companyId?: number): Record<string, string> {
  if (!companyId) return {};
  return { companyId: companyId.toString() };
}
