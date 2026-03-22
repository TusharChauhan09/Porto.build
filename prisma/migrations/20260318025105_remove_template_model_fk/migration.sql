/*
  Warnings:

  - You are about to drop the `template` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "portfolio" DROP CONSTRAINT "portfolio_templateId_fkey";

-- DropTable
DROP TABLE "template";
