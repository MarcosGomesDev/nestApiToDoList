import { DateTime } from 'prisma';

export class Task {
  id: string;

  task: string;

  isChecked: boolean;

  userId: string;

  created_at: DateTime;

  updated_at: DateTime;
}
