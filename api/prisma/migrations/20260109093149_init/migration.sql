-- CreateTable
CREATE TABLE `tb_buku` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(10) NOT NULL,
    `judul` VARCHAR(100) NOT NULL,
    `pengarang` VARCHAR(100) NOT NULL,
    `penerbit` VARCHAR(100) NOT NULL,
    `tahun` VARCHAR(4) NOT NULL,

    UNIQUE INDEX `tb_buku_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
