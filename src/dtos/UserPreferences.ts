import { object, string, boolean } from 'zod'

export const UserPreferencesDto = object({
  theme: string().min(1, 'Theme must be at least 1 character long').max(250, 'Theme must be at most 250 characters long').default('light'),
  lang: string().min(1, 'Language must be at least 1 character long').max(250, 'Language must be at most 250 characters long').default('es'),
  notificationsEnabled: boolean(),
  notificationsType: string(),
})