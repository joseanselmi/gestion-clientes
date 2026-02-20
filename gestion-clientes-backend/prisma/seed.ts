import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateCodigo(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 900 + 100).toString();
  return `CLI-${timestamp}-${random}`;
}

async function main() {
  console.log('Limpiando datos existentes...');
  await prisma.cliente.deleteMany();

  console.log('Creando clientes de ejemplo...');

  const clientes = [
    {
      id: 'seed-cliente-001',
      codigo: 'CLI-001234-567',
      nombreCompleto: 'María García López',
      telefono: '+34 612 345 678',
      email: 'maria.garcia@example.com',
      fechaNacimiento: new Date('1990-03-15'),
      observaciones: 'Cliente habitual. Prefiere citas por la tarde.',
      fechaAlta: new Date('2024-01-15'),
    },
    {
      id: 'seed-cliente-002',
      codigo: 'CLI-001235-789',
      nombreCompleto: 'Carlos Rodríguez Pérez',
      telefono: '+34 623 456 789',
      email: 'carlos.rodriguez@example.com',
      fechaNacimiento: new Date('1985-07-22'),
      observaciones: null,
      fechaAlta: new Date('2024-02-03'),
    },
    {
      id: 'seed-cliente-003',
      codigo: 'CLI-001236-123',
      nombreCompleto: 'Ana Martínez Sánchez',
      telefono: '+34 634 567 890',
      email: 'ana.martinez@example.com',
      fechaNacimiento: null,
      observaciones: 'Alergia a ciertos productos. Ver ficha.',
      fechaAlta: new Date('2024-03-10'),
    },
  ];

  for (const cliente of clientes) {
    await prisma.cliente.create({ data: cliente });
    console.log(`  ✓ ${cliente.nombreCompleto} (${cliente.codigo})`);
  }

  console.log(`\nSeed completado: ${clientes.length} clientes creados.`);
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
