import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClienteEntity {
  @ApiProperty({ example: 'clg7x2k0000008ml1234abcd' })
  id: string;

  @ApiProperty({ example: 'CLI-001234-567' })
  codigo: string;

  @ApiProperty({ example: 'María García López' })
  nombreCompleto: string;

  @ApiProperty({ example: '+34 612 345 678' })
  telefono: string;

  @ApiPropertyOptional({ example: 'maria@example.com' })
  email: string | null;

  @ApiPropertyOptional({ example: '1990-03-15T00:00:00.000Z' })
  fechaNacimiento: Date | null;

  @ApiPropertyOptional({ example: 'Cliente habitual.' })
  observaciones: string | null;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  fechaAlta: Date;
}
