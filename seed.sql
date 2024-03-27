-- Active: 1709013358163@@147.139.210.135@5432@habibi01@public

CREATE TABLE users(idusers VARCHAR(40) PRIMARY KEY NOT NULL,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(50) NOT NULL, 
                    namalengkap VARCHAR(50) NOT NULL,
                    surname VARCHAR(10),
                    alamat TEXT,
                    email VARCHAR(30) NOT NULL,
                    otoritas VARCHAR(10) NOT NULL,
                    created_at TIMESTAMP,
                    edited_at TIMESTAMP)

ALTER TABLE users ALTER COLUMN password TYPE VARCHAR(255)

ALTER TABLE users ADD COLUMN foto TEXT

DROP TABLE users

ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE(email)

DROP TABLE resep

SELECT * FROM users

INSERT INTO users(idusers,username,password,namalengkap,surname,alamat,email,otoritas,created_at,edited_at) VALUES ('superadmin','','habibi1111','habibi ramadhan','habibi','bogor','habibi@gmail.com','member',NOW(),null)

CREATE TABLE resep(idresep VARCHAR(50) PRIMARY KEY NOT NULL,
                    namaresep VARCHAR(40) NOT NULL,
                    idusers VARCHAR(30) NOT NULL,
                    komposisi TEXT NOT NULL,
                    idkategori VARCHAR(30) NOT NULL,
                    foto TEXT,
                    created_at TIMESTAMP,
                    edited_at TIMESTAMP
)

ALTER TABLE resep ADD CONSTRAINT fk_resep_users FOREIGN KEY (idusers) REFERENCES users (idusers)

ALTER TABLE resep ADD CONSTRAINT fk_resep_kategori FOREIGN KEY (idkategori) REFERENCES kategori (idkategori)

INSERT INTO resep(idresep,namaresep,idusers,komposisi,idkategori,foto,created_at,edited_at)
 VALUES ('test-id-resep','Ayam Goreng','user-id-test','ayam, tepung, kunyit, lada, lengkuas','test-id-kategori','localhost:3000/photo',NOW(),NULL)

 SELECT * FROM resep

 SELECT * FROM resep WHERE idresep='07c9f483-54a2-4872-bf5c-04fe7110c8f2'


 CREATE TABLE komentar(idkomentar VARCHAR(50) PRIMARY KEY NOT NULL,
                        idusers VARCHAR(40) NOT NULL,
                        idresep VARCHAR(40) NOT NULL,
                        isi TEXT NOT NULL,
                        created_at TIMESTAMP,
                        edited_at TIMESTAMP)

ALTER TABLE komentar ADD CONSTRAINT fk_komentar_users FOREIGN KEY (idusers) REFERENCES users(idusers)

ALTER TABLE komentar ADD CONSTRAINT fk_komentar_resep FOREIGN KEY (idresep) REFERENCES resep(idresep)

INSERT INTO komentar(idkomentar,idusers,idresep,isi,created_at,edited_at) VALUES ('test-comment-id','user-id-test','test-id-resep','Resep bagus lengkap dan variasi',NOw(),NULL)

SELECT * FROM komentar

DROP TABLE komentar

CREATE TABLE kategori(idkategori VARCHAR(40) PRIMARY KEY NOT NULL,
                        nama VARCHAR(15) NOT NULL,
                        deskripsi TEXT NOT NULL,
                        foto VARCHAR(40) NOT NULL)

INSERT INTO kategori(idkategori,nama,deskripsi,foto) VALUES ('test-id-kategori','Test food','makanan cepat saji yang biasa ada di restauran','localhost/3000')

CREATE TABLE event(idevent VARCHAR(40) PRIMARY KEY NOT NULL,
                    eventname VARCHAR(10) NOT NULL,
                    idusers VARCHAR(40) NOT NULL,
                    idresep VARCHAR(40) NOT NULL,
                    event_time TIMESTAMP)

SELECT * FROM event

ALTER TABLE event ADD CONSTRAINT fk_event_users FOREIGN KEY (idusers) REFERENCES users(idusers)

ALTER TABLE event ADD CONSTRAINT fk_event_resep FOREIGN KEY (idresep) REFERENCES resep(idresep)

INSERT INTO event(idevent,eventname,idusers,idresep,event_time) VALUES ('event-id-test','isliked','user-id-test','test-id-resep',NOW())