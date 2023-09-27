-- DropForeignKey
ALTER TABLE `Comments` DROP FOREIGN KEY `Comments_testerId_fkey`;

-- DropForeignKey
ALTER TABLE `Likes` DROP FOREIGN KEY `Likes_testerId_fkey`;

-- DropForeignKey
ALTER TABLE `Questions` DROP FOREIGN KEY `Questions_testerId_fkey`;

-- DropForeignKey
ALTER TABLE `Results` DROP FOREIGN KEY `Results_testerId_fkey`;

-- DropForeignKey
ALTER TABLE `Thumbnails` DROP FOREIGN KEY `Thumbnails_testerId_fkey`;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_testerId_fkey` FOREIGN KEY (`testerId`) REFERENCES `Testers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_testerId_fkey` FOREIGN KEY (`testerId`) REFERENCES `Testers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Thumbnails` ADD CONSTRAINT `Thumbnails_testerId_fkey` FOREIGN KEY (`testerId`) REFERENCES `Testers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Results` ADD CONSTRAINT `Results_testerId_fkey` FOREIGN KEY (`testerId`) REFERENCES `Testers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questions` ADD CONSTRAINT `Questions_testerId_fkey` FOREIGN KEY (`testerId`) REFERENCES `Testers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
