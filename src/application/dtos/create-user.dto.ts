import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'O nome não pode ser vazio!',
  })
  @MinLength(3, {
    message: 'Mínimo de 3 caracteres',
  })
  name: string;

  @IsNotEmpty({
    message: 'O e-mail não pode ser vazio!',
  })
  @IsEmail(
    {},
    {
      message: 'E-mail inválido!',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'A senha não pode ser vazia!',
  })
  password: string;
}
