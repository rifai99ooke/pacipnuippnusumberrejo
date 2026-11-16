import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { nama, kontak, subjek, pesan } = await req.json()

    if (!nama || !kontak || !subjek || !pesan) {
      return NextResponse.json(
        { pesan: 'Semua kolom wajib diisi.' },
        { status: 400 }
      )
    }

    // 1. Simpan ke Supabase
    const { error: dbError } = await supabase.from('pesan_masuk').insert({
      nama,
      kontak,
      subjek,
      pesan,
      sudah_dibaca: false,
    })

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json(
        { pesan: 'Gagal menyimpan pesan: ' + dbError.message },
        { status: 500 }
      )
    }

    // 2. Kirim email notifikasi (tidak gagalkan response jika email error)
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS
    const emailTo   = process.env.EMAIL_TO

    if (emailUser && emailPass && emailTo && !emailPass.includes('isi_app_password')) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: emailUser, pass: emailPass },
        })

        await transporter.sendMail({
          from: `"Website IPNU IPPNU Sumberrejo" <${emailUser}>`,
          to: emailTo,
          subject: `[Pesan Baru] ${subjek} - dari ${nama}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
              <h2 style="color:#16a34a;margin-bottom:20px;">📩 Pesan Baru dari Website</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;font-weight:bold;color:#374151;width:140px;">Nama</td><td style="padding:8px 0;color:#6b7280;">: ${nama}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold;color:#374151;">Kontak</td><td style="padding:8px 0;color:#6b7280;">: ${kontak}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold;color:#374151;">Subjek</td><td style="padding:8px 0;color:#6b7280;">: ${subjek}</td></tr>
              </table>
              <div style="margin-top:16px;">
                <p style="font-weight:bold;color:#374151;margin-bottom:8px;">Isi Pesan:</p>
                <div style="background:#f9fafb;padding:16px;border-radius:8px;color:#374151;white-space:pre-wrap;">${pesan}</div>
              </div>
              <hr style="margin:24px 0;border-color:#e5e7eb;"/>
              <p style="font-size:12px;color:#9ca3af;">Dikirim dari form Hubungi Kami · <a href="http://localhost:3000/admin/pesan" style="color:#16a34a;">Lihat di Admin Panel</a></p>
            </div>
          `,
        })

        console.log('Email notifikasi terkirim ke', emailTo)
      } catch (emailErr) {
        // Email gagal tidak menggagalkan response ke user
        console.error('Email gagal (pesan tetap tersimpan):', emailErr)
      }
    }

    return NextResponse.json({ pesan: 'Pesan berhasil dikirim!' }, { status: 200 })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json(
      { pesan: 'Terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
