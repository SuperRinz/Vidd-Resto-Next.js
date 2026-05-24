import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import os

def send_weekly_report(target_email, file_path):
    # Konfigurasi Akun (Taruh di .env lu!)
    sender_email = "leviathan.xv.09@gmail.com"
    app_password = "ymunzjwqwsrmbfzm" # Password 16 digit tadi

    # 1. Setup Pesan
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = target_email
    msg['Subject'] = "📊 Laporan Mingguan Vidd-Resto AI"

    body = """
    Selamat Malam Owner,
    
    Terlampir laporan penjualan resto Anda untuk minggu ini. 
    AI kami telah menganalisis tren penjualan dan memberikan saran stok untuk minggu depan.
    
    Terima Kasih,
    Vidd-Resto AI Team
    """
    msg.attach(MIMEText(body, 'plain'))

    # 2. Lampirkan PDF
    # Menggunakan os.path biar jalannya dinamis di server cloud maupun lokal
    nama_file_pdf = "Laporan_resto.pdf"
    path_file_saat_ini = os.path.join(os.getcwd(), nama_file_pdf)

    with open(path_file_saat_ini, "rb") as attachment:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f"attachment; filename= {nama_file_pdf}")
        msg.attach(part)

    # 3. Kirim lewat server Gmail
    try:
        server = smtplib.SMTP('smtp.gmail.com', 465)
        server.starttls()
        server.login(sender_email, app_password)
        server.send_message(msg)
        server.quit()
        print(f"Laporan berhasil dikirim ke {target_email}!")
    except Exception as e:
        print(f"Gagal kirim email: {e}")

if __name__ == "__main__":
    # Test kirim ke email lu sendiri
    send_weekly_report("davidabdie09@gmail.com", "vidd_resto_weekly_report.pdf")
