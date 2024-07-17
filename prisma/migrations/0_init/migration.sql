-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('EMPLOYED', 'UNEMPLOYED', 'STUDENT', 'RETIRED');

-- CreateTable
CREATE TABLE "AssimUser" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "employmentStatus" "EmploymentStatus" NOT NULL,

    CONSTRAINT "AssimUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssimUser_email_key" ON "AssimUser"("email");

