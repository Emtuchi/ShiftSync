/*
  Warnings:

  - A unique constraint covering the columns `[shiftId,staffId]` on the table `ShiftAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ShiftAssignment_shiftId_staffId_key" ON "ShiftAssignment"("shiftId", "staffId");
