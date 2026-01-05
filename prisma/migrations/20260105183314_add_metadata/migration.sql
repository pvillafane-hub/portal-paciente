/*
  Warnings:

  - Added the required column `docType` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facility` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyDate` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "docType" TEXT NOT NULL,
ADD COLUMN     "facility" TEXT NOT NULL,
ADD COLUMN     "studyDate" TIMESTAMP(3) NOT NULL;
