export interface AppUser {
  id: string;
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
  joinedAt?: string; // ISO date (옵션)
}
