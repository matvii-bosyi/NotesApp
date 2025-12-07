/*
  Warnings:

  - You are about to drop the column `verification_token` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_verification_token_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verification_token";
