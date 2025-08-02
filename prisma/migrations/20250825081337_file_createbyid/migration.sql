/*
  Warnings:

  - You are about to drop the column `CreatedBy` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `ImageResource` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `File` table. All the data in the column will be lost.
  - You are about to alter the column `size` on the `File` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `UnsignedInt`.

*/
-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_CreatedBy_fkey`;

-- DropIndex
DROP INDEX `ImageResource` ON `File`;

-- AlterTable
ALTER TABLE `File` DROP COLUMN `CreatedBy`,
    DROP COLUMN `ImageResource`,
    DROP COLUMN `rank`,
    ADD COLUMN `createdById` VARCHAR(36) NULL,
    MODIFY `size` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
