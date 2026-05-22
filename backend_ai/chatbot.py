import os
from google import genai
from db import get_supabase_client 
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_resto_data():
    supabase = get_supabase_client()
    # Ambil 7 hari terakhir dari view ml_ready_v3
    res = supabase.table("ml_ready_v3") \
        .select("sales_date, daily_revenue") \
        .order("sales_date", desc=True) \
        .limit(7) \
        .execute()
    
    # Ubah jadi teks yang enak dibaca AI
    data_str = ""
    for row in res.data:
        data_str += f"- Tanggal {row['sales_date']}: Omzet Rp {row['daily_revenue']:,}\n"
    
    return data_str

def tanya_vidd_bot(user_question):
    # 1. Ambil data asli dari database
    context_data = get_resto_data()
    
    # 2. Susun Prompt (Instruksi)
    prompt = f"""
    Lu adalah 'Vidd-Bot', asisten pinter buat owner resto Vidd-Resto.
    Gaya bicara lu santai, cerdas, dikit tengil tapi tetep helpful (kayak temen nongkrong tech).
    
    Ini data penjualan terakhir dari database:
    {context_data}
    
    Pertanyaan Owner: "{user_question}"
    
    Jawab berdasarkan data di atas. Kalau datanya nggak ada, bilang aja jujur. 
    Jangan ngarang angka!
    """
    
    # 3. Kirim ke Gemini
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )
    
    return response.text

if __name__ == "__main__":
    # Test tanya
    print(tanya_vidd_bot("Gimana jualan gw minggu ini bro? Rame gak?"))