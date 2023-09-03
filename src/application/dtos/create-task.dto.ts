import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({
    message: 'O nome não pode ser vazio!',
  })
  task: string;
}
