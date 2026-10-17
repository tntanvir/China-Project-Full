import bcrypt from "bcryptjs";
import { prisma } from "./src/app/shared/prisma";
import { seedRbac } from "./src/app/shared/seedRbac";
import config from "./src/config";

async function createSuperUser() {
  const email = process.argv[2] || config.super_admin.email || "admin@example.com";
  const password = process.argv[3] || config.super_admin.password || "Password123!";
  const name = process.argv[4] || "Super Admin";

  console.log(`\n⏳ Setting up Super Admin user...`);
  console.log(`📧 Target Email: ${email}`);

  try {
    // 1. Seed RBAC roles & permissions
    await seedRbac();

    // 2. Hash password
    const saltRounds = Number(config.salt_round) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Find or Create User
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          isVerified: true,
          needPasswordChange: false,
          name,
        },
      });
      console.log(`🔄 Updated existing user to SUPER_ADMIN.`);
    } else {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          isVerified: true,
          needPasswordChange: false,
          name,
        },
      });
      console.log(`✨ Created new SUPER_ADMIN user.`);
    }

    // 4. Ensure Admin model profile exists
    await prisma.admin.upsert({
      where: { email },
      update: {
        userId: user.id,
        name,
        isDeleted: false,
      },
      create: {
        userId: user.id,
        email,
        name,
      },
    });

    // 5. Assign system super-admin RBAC role
    const superAdminRole = await prisma.accessRole.findUnique({
      where: { slug: "super-admin" },
    });

    if (superAdminRole) {
      await prisma.userAccessRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: superAdminRole.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: superAdminRole.id,
        },
      });
    }

    console.log(`\n🎉 Super User created successfully!`);
    console.log(`──────────────────────────────────────────`);
    console.log(`🔑 Login Credentials:`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role:     SUPER_ADMIN`);
    console.log(`   Status:   ACTIVE (Verified)`);
    console.log(`──────────────────────────────────────────\n`);
  } catch (error) {
    console.error("❌ Error creating super user:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

createSuperUser();
