-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
    `type` ENUM('Human', 'AI') NOT NULL DEFAULT 'Human',
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `fullname` VARCHAR(191) NULL,
    `image` TEXT NULL,
    `active` BOOLEAN NULL,
    `sudo` BOOLEAN NOT NULL DEFAULT false,
    `data` JSON NULL,
    `intro` TEXT NOT NULL DEFAULT '',
    `content` MEDIUMTEXT NOT NULL DEFAULT '',

    INDEX `User_type_idx`(`type`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `id` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expiredAt` DATETIME(0) NULL,
    `userId` VARCHAR(36) NULL,

    INDEX `Token_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(32) NOT NULL,
    `path` MEDIUMTEXT NOT NULL,
    `name` MEDIUMTEXT NULL,
    `filename` MEDIUMTEXT NULL,
    `mimetype` MEDIUMTEXT NOT NULL,
    `encoding` MEDIUMTEXT NOT NULL,
    `hash` MEDIUMTEXT NULL,
    `size` DECIMAL(65, 30) NULL,
    `ImageResource` VARCHAR(32) NULL,
    `CreatedBy` VARCHAR(32) NULL,
    `rank` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `CreatedBy`(`CreatedBy`),
    INDEX `ImageResource`(`ImageResource`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatMessage` (
    `id` VARCHAR(36) NOT NULL,
    `text` TEXT NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `mood` DOUBLE NOT NULL DEFAULT 0,
    `assertiveness` DOUBLE NOT NULL DEFAULT 0,
    `intentTone` DOUBLE NOT NULL DEFAULT 0,
    `socialGoal` VARCHAR(191) NULL,
    `tags` VARCHAR(191) NULL,
    `createdBy` VARCHAR(36) NOT NULL,
    `toUserId` VARCHAR(36) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MindLog` (
    `id` VARCHAR(32) NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('Stimulus', 'Reaction', 'Action', 'Result', 'Conclusion', 'Evaluation', 'Correction', 'Knowledge') NOT NULL,
    `data` TEXT NOT NULL,
    `quality` DOUBLE NULL,
    `createdById` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_CreatedBy_fkey` FOREIGN KEY (`CreatedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_toUserId_fkey` FOREIGN KEY (`toUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MindLog` ADD CONSTRAINT `MindLog_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
