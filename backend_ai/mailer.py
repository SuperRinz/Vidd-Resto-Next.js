import os
import base64
import requests

def send_weekly_report(target_email, file_path):
    # Ambil API Key dari Environment Variable Railway
    resend_api_key = os.getenv("RESEND_API_KEY")
    
    if not resend_api_key:
        print("Error: RESEND_API_KEY belum dipasang di env Railway!")
        return

    # 1. Validasi File PDF
    if not os.path.exists(file_path):
        print(f"Error: File report {file_path} tidak ditemukan!")
        return
    
    nama_file = "Laporan_resto.pdf"
    file_path = os.path.join(os.getcwd(), nama_file) # Pastikan path dinamis sesuai lokasi server cloud/lokal

    # 2. Convert PDF ke Base64 (Syarat mutlak kirim attachment via API)
    with open(file_path, "rb") as pdf_file:
        encoded_pdf = base64.b64encode(pdf_file.read()).decode("utf-8")

    # 3. Struktur Konten Email
    payload = {
        "from": "Vidd-Resto AI <onboarding@resend.dev>", # Sender sandbox default Resend
        "to": [target_email],
        "subject": "📊 Laporan Mingguan Vidd-Resto AI",
        "html": """
        <h3>Selamat Malam Owner,</h3>
        <p>Terlampir laporan penjualan resto Anda untuk minggu ini.</p>
        <p>AI kami telah menganalisis tren penjualan dan memberikan saran stok untuk minggu depan.</p>
        <br>
        <p>Terima Kasih,<br><strong>Vidd-Resto AI Team</strong></p>
        """,
        "attachments": [
            {
                "content": encoded_pdf,
                "filename": nama_file,
            }
        ]
    }

    headers = {
        "Authorization": f"Bearer {resend_api_key}",
        "Content-Type": "application/json"
    }

    # 4. Tembak lewat jalur HTTP API (Port 443 - Dijamin lolos gembok cloud!)
    try:
        url = "https://api.resend.com/emails"
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code in [200, 201]:
            print(f"Laporan sukses dikirim via HTTP API ke {target_email}!")
        else:
            print(f"Gagal kirim via Resend API: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"Gagal koneksi ke server Resend API: {e}")

if __name__ == "__main__":
    # Test lokal
    send_weekly_report("davidabdie09@gmail.com", "laporan_resto.pdf")