-- =============================================
-- SCHEMA PAC IPNU IPPNU SUMBERREJO
-- Jalankan di Supabase SQL Editor
-- =============================================

-- 1. Beranda (Sambutan Ketua)
CREATE TABLE IF NOT EXISTS beranda (
  id BIGSERIAL PRIMARY KEY,
  nama_ketua_ipnu TEXT NOT NULL,
  jabatan_ketua_ipnu TEXT DEFAULT 'Ketua PAC IPNU',
  foto_ketua_ipnu TEXT,
  sambutan_ketua_ipnu TEXT,
  tagline_ketua_ipnu TEXT,
  nama_ketua_ippnu TEXT NOT NULL,
  jabatan_ketua_ippnu TEXT DEFAULT 'Ketua PAC IPPNU',
  foto_ketua_ippnu TEXT,
  sambutan_ketua_ippnu TEXT,
  tagline_ketua_ippnu TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Visi Misi
CREATE TABLE IF NOT EXISTS visi_misi (
  id BIGSERIAL PRIMARY KEY,
  visi TEXT NOT NULL,
  misi JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pengurus (Struktur Kepengurusan)
CREATE TABLE IF NOT EXISTS pengurus (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  organisasi TEXT CHECK (organisasi IN ('IPNU', 'IPPNU')) NOT NULL,
  departemen TEXT,
  foto TEXT,
  urutan INT DEFAULT 0,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Estafet Kepemimpinan
CREATE TABLE IF NOT EXISTS estafet (
  id BIGSERIAL PRIMARY KEY,
  periode TEXT NOT NULL,
  nama_ketua_ipnu TEXT NOT NULL,
  foto_ketua_ipnu TEXT,
  nama_ketua_ippnu TEXT NOT NULL,
  foto_ketua_ippnu TEXT,
  aktif BOOLEAN DEFAULT FALSE,
  urutan INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Program Kerja
CREATE TABLE IF NOT EXISTS program_kerja (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  departemen TEXT NOT NULL,
  keterangan TEXT,
  frekuensi TEXT,
  urutan INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Agenda Kegiatan
CREATE TABLE IF NOT EXISTS agenda (
  id BIGSERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  tanggal DATE NOT NULL,
  waktu_mulai TIME,
  waktu_selesai TIME,
  lokasi TEXT,
  foto TEXT,
  status TEXT CHECK (status IN ('akan_datang', 'selesai')) DEFAULT 'akan_datang',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Dokumentasi (Album)
CREATE TABLE IF NOT EXISTS dokumentasi (
  id BIGSERIAL PRIMARY KEY,
  nama_kegiatan TEXT NOT NULL,
  tanggal DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Foto Dokumentasi
CREATE TABLE IF NOT EXISTS dokumentasi_foto (
  id BIGSERIAL PRIMARY KEY,
  dokumentasi_id BIGINT REFERENCES dokumentasi(id) ON DELETE CASCADE,
  foto TEXT NOT NULL,
  keterangan TEXT,
  urutan INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Prestasi
CREATE TABLE IF NOT EXISTS prestasi (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  juara TEXT CHECK (juara IN ('1', '2', '3')) NOT NULL,
  tingkat TEXT NOT NULL,
  peraih TEXT NOT NULL,
  penyelenggara TEXT NOT NULL,
  tanggal DATE NOT NULL,
  deskripsi TEXT,
  foto TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Berita
CREATE TABLE IF NOT EXISTS berita (
  id BIGSERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  kategori TEXT NOT NULL,
  ringkasan TEXT NOT NULL,
  isi TEXT NOT NULL,
  foto TEXT,
  tanggal_publish DATE NOT NULL DEFAULT CURRENT_DATE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('beranda', 'beranda', true),
  ('pengurus', 'pengurus', true),
  ('estafet', 'estafet', true),
  ('agenda', 'agenda', true),
  ('dokumentasi', 'dokumentasi', true),
  ('prestasi', 'prestasi', true),
  ('berita', 'berita', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- RLS POLICIES (buka akses baca untuk publik)
-- =============================================
ALTER TABLE beranda ENABLE ROW LEVEL SECURITY;
ALTER TABLE visi_misi ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengurus ENABLE ROW LEVEL SECURITY;
ALTER TABLE estafet ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_kerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumentasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumentasi_foto ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;

-- Baca publik untuk semua tabel
CREATE POLICY "Public read" ON beranda FOR SELECT USING (true);
CREATE POLICY "Public read" ON visi_misi FOR SELECT USING (true);
CREATE POLICY "Public read" ON pengurus FOR SELECT USING (true);
CREATE POLICY "Public read" ON estafet FOR SELECT USING (true);
CREATE POLICY "Public read" ON program_kerja FOR SELECT USING (true);
CREATE POLICY "Public read" ON agenda FOR SELECT USING (true);
CREATE POLICY "Public read" ON dokumentasi FOR SELECT USING (true);
CREATE POLICY "Public read" ON dokumentasi_foto FOR SELECT USING (true);
CREATE POLICY "Public read" ON prestasi FOR SELECT USING (true);
CREATE POLICY "Public read" ON berita FOR SELECT USING (true);

-- Storage publik bisa dibaca
CREATE POLICY "Public read storage" ON storage.objects FOR SELECT USING (bucket_id IN ('beranda','pengurus','estafet','agenda','dokumentasi','prestasi','berita'));

-- =============================================
-- Pesan Masuk (Form Hubungi Kami)
-- =============================================
CREATE TABLE IF NOT EXISTS pesan_masuk (
  id           bigserial PRIMARY KEY,
  nama         text NOT NULL,
  kontak       text NOT NULL,
  subjek       text NOT NULL,
  pesan        text NOT NULL,
  sudah_dibaca boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pesan_masuk ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_anon" ON pesan_masuk FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "select_anon" ON pesan_masuk FOR SELECT TO anon USING (true);
CREATE POLICY "update_anon" ON pesan_masuk AS PERMISSIVE FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "delete_anon" ON pesan_masuk AS PERMISSIVE FOR DELETE TO anon USING (true);
