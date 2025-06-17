/*
  Warnings:

  - Added the required column `chargeOutRate` to the `ContractorRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContractorRate" ADD COLUMN     "chargeOutRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "isFixed" BOOLEAN NOT NULL DEFAULT false;
