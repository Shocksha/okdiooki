import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Users
  const adminPassword = await bcrypt.hash('admin123', 12)
  const managerPassword = await bcrypt.hash('manager123', 12)
  const employeePassword = await bcrypt.hash('employee123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@webagency.com' },
    update: {},
    create: {
      email: 'admin@webagency.com',
      name: 'Marco Rossi',
      password: adminPassword,
      role: 'ADMIN',
      position: 'CEO & Founder',
      phone: '+39 02 1234567',
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@webagency.com' },
    update: {},
    create: {
      email: 'manager@webagency.com',
      name: 'Giulia Ferrari',
      password: managerPassword,
      role: 'MANAGER',
      position: 'Project Manager',
      phone: '+39 02 9876543',
    },
  })

  const dev1 = await prisma.user.upsert({
    where: { email: 'luca@webagency.com' },
    update: {},
    create: {
      email: 'luca@webagency.com',
      name: 'Luca Bianchi',
      password: employeePassword,
      role: 'EMPLOYEE',
      position: 'Senior Developer',
      phone: '+39 02 5556677',
    },
  })

  const dev2 = await prisma.user.upsert({
    where: { email: 'sara@webagency.com' },
    update: {},
    create: {
      email: 'sara@webagency.com',
      name: 'Sara Conti',
      password: employeePassword,
      role: 'EMPLOYEE',
      position: 'UI/UX Designer',
      phone: '+39 02 4445566',
    },
  })

  // Clients
  const client1 = await prisma.client.upsert({
    where: { id: 'client-1' },
    update: {},
    create: {
      id: 'client-1',
      name: 'Innovatech SRL',
      email: 'info@innovatech.it',
      phone: '+39 02 8889900',
      company: 'Innovatech SRL',
      address: 'Via Roma 42, Milano',
      website: 'https://innovatech.it',
      status: 'ACTIVE',
      notes: 'Cliente storico, sempre puntuale nei pagamenti.',
    },
  })

  const client2 = await prisma.client.upsert({
    where: { id: 'client-2' },
    update: {},
    create: {
      id: 'client-2',
      name: 'FoodChain SpA',
      email: 'marketing@foodchain.it',
      phone: '+39 06 1122334',
      company: 'FoodChain SpA',
      address: 'Corso Venezia 10, Roma',
      website: 'https://foodchain.it',
      status: 'ACTIVE',
      notes: 'Catena di ristoranti. Necessita di aggiornamenti frequenti.',
    },
  })

  const client3 = await prisma.client.upsert({
    where: { id: 'client-3' },
    update: {},
    create: {
      id: 'client-3',
      name: 'ModeItalia',
      email: 'digital@modeitalia.com',
      phone: '+39 055 3344556',
      company: 'ModeItalia SRL',
      address: 'Via della Vigna Nuova 8, Firenze',
      website: 'https://modeitalia.com',
      status: 'PROSPECT',
      notes: 'Contatto nuovo, in trattativa per sito e-commerce.',
    },
  })

  const client4 = await prisma.client.upsert({
    where: { id: 'client-4' },
    update: {},
    create: {
      id: 'client-4',
      name: 'TechStartup XYZ',
      email: 'cto@techstartup.io',
      phone: '+39 011 7788990',
      company: 'TechStartup XYZ',
      address: 'Via Po 21, Torino',
      website: 'https://techstartup.io',
      status: 'INACTIVE',
    },
  })

  // Projects
  const project1 = await prisma.project.upsert({
    where: { id: 'project-1' },
    update: {},
    create: {
      id: 'project-1',
      name: 'Redesign Sito Innovatech',
      description: 'Completo redesign del sito aziendale con nuova brand identity e CMS.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-11-30'),
      budget: 12000,
      spent: 5400,
      clientId: client1.id,
      createdById: admin.id,
    },
  })

  const project2 = await prisma.project.upsert({
    where: { id: 'project-2' },
    update: {},
    create: {
      id: 'project-2',
      name: 'App Ordini FoodChain',
      description: 'Applicazione web per la gestione degli ordini dei ristoranti della catena.',
      status: 'REVIEW',
      priority: 'URGENT',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-10-31'),
      budget: 25000,
      spent: 22000,
      clientId: client2.id,
      createdById: manager.id,
    },
  })

  const project3 = await prisma.project.upsert({
    where: { id: 'project-3' },
    update: {},
    create: {
      id: 'project-3',
      name: 'E-commerce ModeItalia',
      description: 'Sviluppo piattaforma e-commerce con catalogo prodotti e gestione stock.',
      status: 'PLANNING',
      priority: 'HIGH',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-03-31'),
      budget: 35000,
      spent: 0,
      clientId: client3.id,
      createdById: admin.id,
    },
  })

  const project4 = await prisma.project.upsert({
    where: { id: 'project-4' },
    update: {},
    create: {
      id: 'project-4',
      name: 'Landing Page TechStartup',
      description: 'Landing page per lancio prodotto SaaS.',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-07-15'),
      budget: 5000,
      spent: 4800,
      clientId: client4.id,
      createdById: manager.id,
    },
  })

  // Tasks for project 1
  await prisma.task.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'task-1',
        title: 'Analisi brand e brief creativo',
        description: 'Incontro con il cliente per definire direzione creativa.',
        status: 'DONE',
        priority: 'HIGH',
        estimatedHours: 8,
        projectId: project1.id,
        assigneeId: sara.id,
        dueDate: new Date('2024-09-10'),
      },
      {
        id: 'task-2',
        title: 'Wireframe pagine principali',
        description: 'Home, About, Servizi, Contatti, Blog.',
        status: 'DONE',
        priority: 'HIGH',
        estimatedHours: 16,
        projectId: project1.id,
        assigneeId: sara.id,
        dueDate: new Date('2024-09-20'),
      },
      {
        id: 'task-3',
        title: 'Sviluppo frontend Next.js',
        description: 'Implementazione UI basata sui wireframe approvati.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        estimatedHours: 40,
        projectId: project1.id,
        assigneeId: dev1.id,
        dueDate: new Date('2024-10-31'),
      },
      {
        id: 'task-4',
        title: 'Integrazione CMS Headless',
        description: 'Setup e configurazione Sanity.io per la gestione contenuti.',
        status: 'TODO',
        priority: 'MEDIUM',
        estimatedHours: 20,
        projectId: project1.id,
        assigneeId: dev1.id,
        dueDate: new Date('2024-11-15'),
      },
      {
        id: 'task-5',
        title: 'SEO & Performance optimization',
        description: 'Ottimizzazione Core Web Vitals e meta tag.',
        status: 'TODO',
        priority: 'MEDIUM',
        estimatedHours: 12,
        projectId: project1.id,
        assigneeId: admin.id,
        dueDate: new Date('2024-11-25'),
      },
    ],
  })

  // Tasks for project 2
  await prisma.task.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'task-6',
        title: 'Architettura backend API',
        description: 'Design e implementazione REST API con Node.js.',
        status: 'DONE',
        priority: 'URGENT',
        estimatedHours: 30,
        projectId: project2.id,
        assigneeId: dev1.id,
        dueDate: new Date('2024-08-15'),
      },
      {
        id: 'task-7',
        title: 'Dashboard amministrazione',
        description: 'Pannello per la gestione dei ristoranti.',
        status: 'REVIEW',
        priority: 'HIGH',
        estimatedHours: 25,
        projectId: project2.id,
        assigneeId: dev1.id,
        dueDate: new Date('2024-10-15'),
      },
      {
        id: 'task-8',
        title: 'Testing e QA',
        description: 'Test funzionali su tutti i flussi principali.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        estimatedHours: 15,
        projectId: project2.id,
        assigneeId: manager.id,
        dueDate: new Date('2024-10-25'),
      },
    ],
  })

  // Time entries
  await prisma.timeEntry.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'te-1',
        description: 'Wireframe homepage',
        hours: 6,
        date: new Date('2024-09-12'),
        projectId: project1.id,
        taskId: 'task-2',
        userId: sara.id,
      },
      {
        id: 'te-2',
        description: 'Setup Next.js + Tailwind',
        hours: 4,
        date: new Date('2024-09-22'),
        projectId: project1.id,
        taskId: 'task-3',
        userId: dev1.id,
      },
      {
        id: 'te-3',
        description: 'Sviluppo header e navigation',
        hours: 8,
        date: new Date('2024-10-01'),
        projectId: project1.id,
        taskId: 'task-3',
        userId: dev1.id,
      },
      {
        id: 'te-4',
        description: 'API endpoints ordini',
        hours: 12,
        date: new Date('2024-08-05'),
        projectId: project2.id,
        taskId: 'task-6',
        userId: dev1.id,
      },
      {
        id: 'te-5',
        description: 'Dashboard frontend',
        hours: 10,
        date: new Date('2024-09-15'),
        projectId: project2.id,
        taskId: 'task-7',
        userId: dev1.id,
      },
    ],
  })

  // Invoices
  const invoice1 = await prisma.invoice.upsert({
    where: { id: 'invoice-1' },
    update: {},
    create: {
      id: 'invoice-1',
      number: 'INV-2024-001',
      status: 'PAID',
      issueDate: new Date('2024-08-01'),
      dueDate: new Date('2024-08-31'),
      subtotal: 6000,
      tax: 1320,
      total: 7320,
      clientId: client1.id,
      projectId: project1.id,
      notes: 'Acconto 50% progetto redesign sito.',
    },
  })

  await prisma.invoiceItem.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'ii-1',
        description: 'Analisi e progettazione UX/UI',
        quantity: 1,
        unitPrice: 2500,
        total: 2500,
        invoiceId: invoice1.id,
      },
      {
        id: 'ii-2',
        description: 'Sviluppo Frontend - Fase 1',
        quantity: 1,
        unitPrice: 3500,
        total: 3500,
        invoiceId: invoice1.id,
      },
    ],
  })

  const invoice2 = await prisma.invoice.upsert({
    where: { id: 'invoice-2' },
    update: {},
    create: {
      id: 'invoice-2',
      number: 'INV-2024-002',
      status: 'SENT',
      issueDate: new Date('2024-09-15'),
      dueDate: new Date('2024-10-15'),
      subtotal: 12500,
      tax: 2750,
      total: 15250,
      clientId: client2.id,
      projectId: project2.id,
      notes: 'Fattura SAL 80% progetto App Ordini.',
    },
  })

  await prisma.invoiceItem.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'ii-3',
        description: 'Sviluppo Backend API REST',
        quantity: 1,
        unitPrice: 5000,
        total: 5000,
        invoiceId: invoice2.id,
      },
      {
        id: 'ii-4',
        description: 'Dashboard Admin - Frontend',
        quantity: 1,
        unitPrice: 4500,
        total: 4500,
        invoiceId: invoice2.id,
      },
      {
        id: 'ii-5',
        description: 'Integrazione sistemi esistenti',
        quantity: 1,
        unitPrice: 3000,
        total: 3000,
        invoiceId: invoice2.id,
      },
    ],
  })

  const invoice3 = await prisma.invoice.upsert({
    where: { id: 'invoice-3' },
    update: {},
    create: {
      id: 'invoice-3',
      number: 'INV-2024-003',
      status: 'OVERDUE',
      issueDate: new Date('2024-07-01'),
      dueDate: new Date('2024-07-31'),
      subtotal: 4800,
      tax: 1056,
      total: 5856,
      clientId: client4.id,
      projectId: project4.id,
      notes: 'Saldo finale landing page.',
    },
  })

  await prisma.invoiceItem.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'ii-6',
        description: 'Landing Page - Design e sviluppo',
        quantity: 1,
        unitPrice: 3800,
        total: 3800,
        invoiceId: invoice3.id,
      },
      {
        id: 'ii-7',
        description: 'Copywriting e SEO On-page',
        quantity: 1,
        unitPrice: 1000,
        total: 1000,
        invoiceId: invoice3.id,
      },
    ],
  })

  const invoice4 = await prisma.invoice.upsert({
    where: { id: 'invoice-4' },
    update: {},
    create: {
      id: 'invoice-4',
      number: 'INV-2024-004',
      status: 'DRAFT',
      issueDate: new Date('2024-10-01'),
      dueDate: new Date('2024-11-01'),
      subtotal: 8750,
      tax: 1925,
      total: 10675,
      clientId: client3.id,
      projectId: project3.id,
      notes: 'Acconto kick-off progetto e-commerce.',
    },
  })

  await prisma.invoiceItem.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'ii-8',
        description: 'Kick-off e analisi requisiti e-commerce',
        quantity: 1,
        unitPrice: 3750,
        total: 3750,
        invoiceId: invoice4.id,
      },
      {
        id: 'ii-9',
        description: 'Setup infrastruttura e architettura',
        quantity: 1,
        unitPrice: 5000,
        total: 5000,
        invoiceId: invoice4.id,
      },
    ],
  })

  console.log('✅ Seed completato!')
  console.log('👤 Credenziali di accesso:')
  console.log('   Admin:    admin@webagency.com / admin123')
  console.log('   Manager:  manager@webagency.com / manager123')
  console.log('   Employee: luca@webagency.com / employee123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
