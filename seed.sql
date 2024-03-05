-- Active: 1709013358163@@147.139.210.135@5432@habibi01@public

CREATE TABLE users(username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(50) NOT NULL, 
                    namaLengkap VARCHAR(50) NOT NULL,
                    surname VARCHAR(10) NOT NULL,
                    email VARCHAR(30) NOT NULL,
                    alamat TEXT
                    created_at TIMESTAMP)

ALTER TABLE users ADD COLUMN edited_at TIMESTAMP

SELECT * FROM users

INSERT INTO users(username,password,namalengkap,surname,email,alamat) VALUES ('habibi01','habibi','habibiramadhan','habibi','habibi@gmail.com','bogor')

DROP TABLE resep

CREATE TABLE resep(idResep VARCHAR(50) UNIQUE,
                    namaResep VARCHAR(40) NOT NULL,
                    author VARCHAR(30) NOT NULL,
                    komposisi TEXT NOT NULL,
                    kategori VARCHAR(30) NOT NULL,
                    foto TEXT,
                    jumlahPenggemar INTEGER NOT NULL,
                    dibuatPada TIMESTAMP,
                    dieditPada TIMESTAMP
)

INSERT INTO resep(idresep,namaresep,author,komposisi,kategori,foto,jumlahpenggemar,dibuatpada,dieditpada)
 VALUES ('test-id-resep','Ayam Goreng','habibi','ayam, tepung, kunyit, lada, lengkuas','Main Course','localhost:3000/photo',0,NOW(),NULL)

 SELECT * FROM resep

 SELECT * FROM resep WHERE idresep='07c9f483-54a2-4872-bf5c-04fe7110c8f2'


 CREATE TABLE komentar(idkomentar VARCHAR(50) UNIQUE,
                        idresep VARCHAR(40) NOT NULL,
                        nama VARCHAR(50) NOT NULL,
                        isi TEXT NOT NULL,
                        likes INTEGER,
                        isEdit BOOLEAN,
                        created_at TIMESTAMP,
                        edited_at TIMESTAMP)

INSERT INTO komentar(idkomentar,idresep,nama,isi,likes,isedit,created_at,edited_at) VALUES ('test-comment-id','test-resep-id','habibi','Resep bagus lengkap dan variasi',0,FALSE,NOw(),NULL)

SELECT * FROM komentar