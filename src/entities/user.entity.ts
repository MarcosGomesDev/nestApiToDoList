import { DateTime } from 'prisma';

export class User {
  id: string;

  name: string;

  email: string;

  password: string;

  isActive: boolean;

  created_at: DateTime;

  updated_at: DateTime;
}
