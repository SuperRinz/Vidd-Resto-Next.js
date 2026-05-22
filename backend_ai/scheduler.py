from apscheduler.schedulers.blocking import BlockingScheduler
from generator import generate_pdf_report
from mailer import send_weekly_report
from pytz import timezone
import datetime

def job_mingguan():
    print(f"[{datetime.datetime.now()}] Memulai proses laporan mingguan...")
    
  
    target_email = "davidabdie09@gmail.com"
    
    # 1. Bikin PDF-nya
    pdf_file = generate_pdf_report()
    
    # 2. Kirim Email-nya
    send_weekly_report(target_email, pdf_file)
    
    print("Selesai! Sampai jumpa minggu depan.")

# Inisialisasi Scheduler
jkt = timezone('Asia/Jakarta')

scheduler = BlockingScheduler(timezone=jkt)

# JADWALKAN: Setiap Senin jam 08:00 pagi
scheduler.add_job(job_mingguan, 'cron', day_of_week='mon', hour=19, minute=30)

print("Scheduler Vidd-Resto aktif... Menunggu hari Senin jam 08:00.")
try:
    scheduler.start()
except (KeyboardInterrupt, SystemExit):
    pass