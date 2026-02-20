import { Module } from '@nestjs/common';
import { ClientesModule } from './clientes/clientes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ClientesModule],
})
export class AppModule {}
