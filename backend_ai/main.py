from fastapi import FastAPI
import joblib
import pandas as pd
from datetime import datetime
import os
from fastapi.middleware.cors import CORSMiddleware
from db import get_supabase_client
from chatbot import tanya_vidd_bot 

# --- TAMBAHAN UNTUK AUTOMATION ---
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler # Pake Background, bukan Blocking buat FastAPI
from pytz import timezone
from generator import generate_pdf_report
from mailer import send_weekly_report

# Fungsi bungkus job mingguan
def job_mingguan():
    print(f"[{datetime.now()}] Memulai proses otomatisasi laporan mingguan...")
    target_email = "davidabdie09@gmail.com"
    
    try:
        # 1. Bikin PDF-nya (Fungsi dari generator.py lu)
        pdf_file = generate_pdf_report() 
        
        # 2. Kirim Email-nya
        send_weekly_report(target_email, pdf_file)
        print("Laporan mingguan sukses diproses dan dikirim!")
    except Exception as e:
        print(f"Gagal menjalankan otomatisasi laporan: {e}")

# Manajemen Lifecycle FastAPI (Pengganti On Startup)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Nyalain scheduler pas FastAPI start
    jkt = timezone('Asia/Jakarta')
    scheduler = BackgroundScheduler(timezone=jkt)
    
    # Jadwal lu: Senin jam 19:30 WIB
    scheduler.add_job(job_mingguan, 'cron', day_of_week='sat', hour=19, minute=30)
    scheduler.start()
    print("🚀 AUTOMATION READY: Scheduler aktif di background server!")
    
    yield # Server jalan melayani request web/API...
    
    # Matikan scheduler pas server shutdown
    scheduler.shutdown()

# --- INITIALIZE APP DENGAN LIFESPAN ---
app = FastAPI(lifespan=lifespan)

# Catatan CORS: Pas deploy nanti, http://localhost:3000 ini diganti URL Vercel lu ya!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vidd-resto-next-js.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Init model machine learning
model = joblib.load("model_resto.pkl")

@app.post("/predict")
async def predict():
    supabase = get_supabase_client()
    res = supabase.table("ml_ready_v3").select("*").execute()
    df_view = pd.DataFrame(res.data)

    df_view = df_view.dropna(subset=['prev_day_revenue'])

    X = df_view[['day_of_week', 'is_weekend', 'prev_day_revenue']]
    y = df_view['daily_revenue']
    model.fit(X, y)

    besok = datetime.now() + pd.Timedelta(days=1)
    hari_besok = besok.weekday()
    is_weekend = 1 if hari_besok >= 5 else 0

    omzet = supabase.table("ml_ready_v3")\
        .select("daily_revenue")\
        .order("sales_date", desc=True)\
        .limit(1).execute()

    omzet_hari_ini = omzet.data[0]['daily_revenue'] if omzet.data else 0

    input_pred = pd.DataFrame([{
        "day_of_week": hari_besok,
        "is_weekend": is_weekend,
        "prev_day_revenue": omzet_hari_ini
    }])

    pred = model.predict(input_pred)[0]

    return {
        "prediction": int(pred),
        "is_weekend": is_weekend
    }

@app.post("/chat")
async def chat_endpoint(data: dict):
    message = data.get("message")
    ai_response = tanya_vidd_bot(message)
    return {"response": ai_response}