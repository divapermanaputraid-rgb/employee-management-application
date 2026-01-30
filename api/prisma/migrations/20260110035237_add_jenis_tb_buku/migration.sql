-- AlterTable
ALTER TABLE `tb_buku` ADD COLUMN `jenis` ENUM('-', 'Komputer', 'Novel', 'Komik') NOT NULL DEFAULT '-';
