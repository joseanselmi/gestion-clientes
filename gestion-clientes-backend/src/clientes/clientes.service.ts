import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryClienteDto } from './dto/query-cliente.dto';

function generateCodigo(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 900 + 100).toString();
  return `CLI-${timestamp}-${random}`;
}

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClienteDto) {
    // Verificar email duplicado
    if (dto.email) {
      const existing = await this.prisma.cliente.findFirst({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException(`Ya existe un cliente con el email: ${dto.email}`);
      }
    }

    // Generar código único
    let codigo: string;
    let codigoExists = true;
    do {
      codigo = generateCodigo();
      const found = await this.prisma.cliente.findUnique({ where: { codigo } });
      codigoExists = !!found;
    } while (codigoExists);

    return this.prisma.cliente.create({
      data: {
        codigo,
        nombreCompleto: dto.nombreCompleto.trim(),
        telefono: dto.telefono.trim(),
        email: dto.email?.trim() || null,
        fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : null,
        observaciones: dto.observaciones?.trim() || null,
      },
    });
  }

  async findAll(query: QueryClienteDto) {
    const { search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { nombreCompleto: { contains: search, mode: 'insensitive' as const } },
            { telefono: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.cliente.findMany({
        where,
        orderBy: { fechaAlta: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.cliente.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con id "${id}" no encontrado`);
    }
    return cliente;
  }

  async update(id: string, dto: UpdateClienteDto) {
    // Verificar que existe
    await this.findOne(id);

    // Verificar email duplicado en otro cliente
    if (dto.email) {
      const existing = await this.prisma.cliente.findFirst({
        where: {
          email: dto.email,
          NOT: { id },
        },
      });
      if (existing) {
        throw new ConflictException(`Ya existe otro cliente con el email: ${dto.email}`);
      }
    }

    const updateData: any = {};
    if (dto.nombreCompleto !== undefined) updateData.nombreCompleto = dto.nombreCompleto.trim();
    if (dto.telefono !== undefined) updateData.telefono = dto.telefono.trim();
    if (dto.email !== undefined) updateData.email = dto.email?.trim() || null;
    if (dto.fechaNacimiento !== undefined) {
      updateData.fechaNacimiento = dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : null;
    }
    if (dto.observaciones !== undefined) {
      updateData.observaciones = dto.observaciones?.trim() || null;
    }

    return this.prisma.cliente.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cliente.delete({ where: { id } });
  }
}
