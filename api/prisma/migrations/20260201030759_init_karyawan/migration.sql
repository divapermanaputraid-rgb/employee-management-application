/*
  Warnings:

  - You are about to drop the `tb_buku` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `tb_buku`;

-- CreateTable
CREATE TABLE `tb_karyawan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nik` VARCHAR(20) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `jabatan` ENUM('Manager', 'Staff', 'Admin', 'Supervisor') NOT NULL DEFAULT 'Staff',
    `departemen` VARCHAR(100) NOT NULL,
    `alamat` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tb_karyawan_nik_key`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
