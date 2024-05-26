# Tugas Besar Grafika Komputer Placeholder

## Deskripsi proyek
Proyek ini ditujukan untuk mengasah kemampuan dan pengetahuan mahasiswa mengenai WebGL dan penggunaannya untuk render grafik tiga dimensi.

Proyek memiliki bentuk sebuah website.

## Deskripsi cara menjalankan program

1. Clone repository https://github.com/GAIB20/tugas-besar-grafkom-2-placeholder
2. Masukkan command `npm install` pada terminal repository
3. Masukkan command `npm run dev` pada terminal repository
4. Masukkan alamat `localhost:4000` pada browser

## Pembagian kerja


| NIM      | Nama                           | Tugas                                                                                                                                                                                                           |
| -------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 13521054 | Wilson Tansil                  | Euler<br>Front-end UI<br>Scene Graph<br>Model articulated, animasi model, model hollow<br>UI dan Logic Camera<br>UI Save and Load<br>2 Camera                                                                   |
| 13521063 | Salomo Reinhart Gregory Manalu | Vector3<br>Camera, Jenis proyeksi camera<br>Orbit Control<br>Model articulated, animasi model, model hollow                                                                                                     |
| 13521089 | Kenneth Ezekiel Suprantoni     | Matrix4<br>Object3D<br>Scene<br>Dokumentasi API<br>glTF-based loader<br>Model articulated, animasi model, model hollow<br>API Save and Load<br>Smooth Shading<br>Animation retargeting                          |
| 13521095 | Muhamad Aji Wibisono           | Quaternion<br>WebGL Utils<br>Material<br>Mesh<br>Geometry<br>Model articulated, animasi model, model hollow<br>Phong material<br>Animation Controller<br>Texture<br>Animation tweening<br>Parallax bump mapping |

## Daftar Spesifikasi
- [x] Fungsi WebGL yang tidak primitive
- [x] Model objek articulated setiap anggota
- [x] Animation articulated model setiap anggota
- [x] Model objek berongga setiap anggota
- [x] Schema glTF loader and saver
- [x] Satu kamera dan satu kanvas
- [x] Loading model
- [x] Mengubah jenis proyeksi untuk menampilkan model
- [x] Mengubah jarak kamera dari model 
- [x] Melakukan translasi untuk perspektif
- [x] Menggerakkan kamera untuk mengitari model dengan mouse
- [x] Reset ke default view
- [x] Material basic dan phong
- [x] Antarmuka mengubah material mesh
- [x] Menampilkan shading warna dasar (ambient) pada basic
- [x] Menampilkan shading directional light pada Phong
	- [x] Shininess
	- [x] Warna
	- [x] Tekstur specular
	- [x] Tekstur diffuse
	- [x] Warna ambient
	- [x] Tekstur displacement
	- [x] Tekstur normal
	- [x] Opsi tidak menggunakan tekstur
- [x] Animasi
	- [x] Indikator frame
	- [x] Control Animation
	- [x] Control Frame
	- [x] Frame per second
- [x] Scene graph
- [x] Implementasi 2 kamera
- [x] Animation retargeting
- [x] Animation tweening
- [x] Smooth shading
- [x] Parallax bump mapping

## Model setiap anggota

| NIM      | Nama                           | Tugas                                                                                                                      |
| -------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 13521054 | Wilson Tansil                  | Articulated model - articulated-wt.json<br>Animation - animation-wt.json<br>Hollow model - hollow-wt.json, hollow-wt1.json |
| 13521063 | Salomo Reinhart Gregory Manalu | Articulated model - articulated-salomo.json<br>Animation - animation-salomo.json<br>Hollow model - hollow-salomo.json      |
| 13521089 | Kenneth Ezekiel Suprantoni     | Articulated model - articulated-ken.json<br>Animation - animation-ken.json<br>Hollow model - hollow-ken.json               |
| 13521095 | Muhamad Aji Wibisono           | Articulated model - articulated-awe.json<br>Animation - animation-awe.json<br>Hollow model - hollow-awe.json               |
