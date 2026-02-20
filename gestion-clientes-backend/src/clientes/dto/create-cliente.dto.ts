import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'María García López',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede superar 200 caracteres' })
  nombreCompleto: string;

  @ApiProperty({
    description: 'Número de teléfono del cliente',
    example: '+34 612 345 678',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @MaxLength(30, { message: 'El teléfono no puede superar 30 caracteres' })
  telefono: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del cliente',
    example: 'maria@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @MaxLength(200, { message: 'El email no puede superar 200 caracteres' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento en formato ISO 8601',
    example: '1990-03-15',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)' })
  fechaNacimiento?: string;

  @ApiPropertyOptional({
    description: 'Observaciones o notas adicionales',
    example: 'Cliente habitual. Prefiere citas por la tarde.',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Las observaciones no pueden superar 2000 caracteres' })
  observaciones?: string;
}
