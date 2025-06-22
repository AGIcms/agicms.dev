-- AlterTable
ALTER TABLE `ChatMessage` ADD COLUMN `usage` JSON NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `intro` TEXT NOT NULL DEFAULT '',
    MODIFY `content` MEDIUMTEXT NOT NULL DEFAULT '';
