-- AlterTable
ALTER TABLE `MindLog` ADD COLUMN `relatedToUserId` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `intro` TEXT NOT NULL DEFAULT '',
    MODIFY `content` MEDIUMTEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX `MindLog_type_idx` ON `MindLog`(`type`);

-- CreateIndex
CREATE INDEX `MindLog_relatedToUserId_idx` ON `MindLog`(`relatedToUserId`);
