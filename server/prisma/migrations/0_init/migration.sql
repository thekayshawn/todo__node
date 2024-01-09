-- CreateTable
CREATE TABLE `todos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `completed` TINYINT NOT NULL DEFAULT 0,

    UNIQUE INDEX `UNIQUE`(`id`),
    INDEX `PRIMARY_KEY`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
