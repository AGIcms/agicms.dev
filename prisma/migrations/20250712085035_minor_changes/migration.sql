-- AlterTable
ALTER TABLE `MindLog` MODIFY `type` ENUM('Stimulus', 'Reaction', 'Action', 'Error', 'Result', 'Conclusion', 'Evaluation', 'Correction', 'Knowledge') NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `intro` TEXT NULL,
    MODIFY `content` MEDIUMTEXT NULL;
