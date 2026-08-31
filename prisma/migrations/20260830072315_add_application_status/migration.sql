-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'active', 'inactive');

-- AlterTable
ALTER TABLE "MembershipApplication" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "MembershipApplication_status_idx" ON "MembershipApplication"("status");
