// prisma/seed.ts
import { PrismaClient, UserRole, ShiftStatus, AssignmentStatus, SwapType, SwapStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: { name: 'Alice Admin', email: 'alice.admin@example.com', password: passwordHash, role: UserRole.ADMIN },
  });

  const manager = await prisma.user.create({
    data: { name: 'Bob Manager', email: 'bob.manager@example.com', password: passwordHash, role: UserRole.MANAGER },
  });

  const staff1 = await prisma.user.create({
    data: { name: 'Charlie Staff', email: 'charlie.staff@example.com', password: passwordHash, role: UserRole.STAFF },
  });

  const staff2 = await prisma.user.create({
    data: { name: 'Dana Staff', email: 'dana.staff@example.com', password: passwordHash, role: UserRole.STAFF },
  });

  // Locations
  const location1 = await prisma.location.create({
    data: { name: 'Downtown Cafe', address: '123 Main St', managers: { connect: { id: manager.id } } },
  });

  const location2 = await prisma.location.create({
    data: { name: 'Uptown Bistro', address: '456 High St', managers: { connect: { id: manager.id } } },
  });

  // Skills
  const bartender = await prisma.skill.create({ data: { name: 'Bartender' } });
  const lineCook = await prisma.skill.create({ data: { name: 'Line Cook' } });
  const server = await prisma.skill.create({ data: { name: 'Server' } });

  await prisma.staffSkill.createMany({
    data: [
      { staffId: staff1.id, skillId: bartender.id },
      { staffId: staff1.id, skillId: server.id },
      { staffId: staff2.id, skillId: lineCook.id },
      { staffId: staff2.id, skillId: server.id },
    ],
  });

  // Staff certifications
  await prisma.staffCertification.createMany({
    data: [
      { staffId: staff1.id, locationId: location1.id },
      { staffId: staff2.id, locationId: location1.id },
      { staffId: staff2.id, locationId: location2.id },
    ],
  });

  // Availability windows
  const now = new Date();
  await prisma.availabilityWindow.createMany({
    data: [
      { staffId: staff1.id, startTime: new Date(now.getTime()), endTime: new Date(now.getTime() + 1000 * 60 * 60 * 8) }, // 8h today
      { staffId: staff2.id, startTime: new Date(now.getTime() + 1000 * 60 * 60 * 1), endTime: new Date(now.getTime() + 1000 * 60 * 60 * 9) },
    ],
  });

  // Shifts
  const shift1 = await prisma.shift.create({
    data: {
      locationId: location1.id,
      startTime: new Date(now.getTime() + 1000 * 60 * 60), // 1h from now
      endTime: new Date(now.getTime() + 1000 * 60 * 60 * 5), // 4h shift
      requiredSkillId: server.id,
      headcount: 2,
      status: ShiftStatus.PUBLISHED,
    },
  });

  const shift2 = await prisma.shift.create({
    data: {
      locationId: location2.id,
      startTime: new Date(now.getTime() + 1000 * 60 * 60 * 24), // tomorrow
      endTime: new Date(now.getTime() + 1000 * 60 * 60 * 28),
      requiredSkillId: lineCook.id,
      headcount: 1,
      status: ShiftStatus.DRAFT,
    },
  });

  // Assign staff to first shift
  const assignment1 = await prisma.shiftAssignment.create({
    data: { shiftId: shift1.id, staffId: staff1.id, status: AssignmentStatus.CONFIRMED },
  });

  const assignment2 = await prisma.shiftAssignment.create({
    data: { shiftId: shift1.id, staffId: staff2.id, status: AssignmentStatus.CONFIRMED },
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: staff1.id, message: 'Welcome to ShiftSync!' },
      { userId: staff2.id, message: 'You have a shift tomorrow.' },
      { userId: manager.id, message: 'New staff added to location.' },
    ],
  });

  // Swap requests
  await prisma.swapRequest.create({
    data: {
      originalAssignmentId: assignment1.id,
      targetStaffId: staff2.id,
      type: SwapType.FULL,
      status: SwapStatus.PENDING,
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });