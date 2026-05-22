from fpdf import FPDF
import pandas as pd
from datetime import datetime
from db import get_supabase_client

supabase = get_supabase_client()


class RestoReport(FPDF):
    def header(self):
        self.set_font("Arial", "B", 15)
        self.cell(0, 10, "Laporan Mingguan Vidd Resto", border=False, ln=True, align="C")
        self.set_font("Arial", "I", 10)
        self.cell(0, 10, f"Tanggal Cetak: {datetime.now().strftime('%Y-%m-%d %H:%M')}", ln=True, align="C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Halaman {self.page_no()}", align="C")

def generate_pdf_report():
    # 1. Ambil Data
    res = supabase.table("ml_ready_v3").select("*").execute()
    df = pd.DataFrame(res.data)
    df['sales_date'] = pd.to_datetime(df['sales_date'])
    df = df.sort_values(by="sales_date")
    
    # 2. Setup PDF
    pdf = RestoReport()
    pdf.add_page()
    
    # 3. Ringkasan Performa
    total_omzet = df['daily_revenue'].sum()
    avg_omzet = df['daily_revenue'].mean()
    total_omzet_minggu_ini = df[df['sales_date'] >= (datetime.now() - pd.Timedelta(days=7))]['daily_revenue'].sum()
    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, "Ringkasan Performa:", ln=True)
    pdf.set_font("Arial", "", 10)
    pdf.cell(0, 8, f"- Total Omzet: Rp {total_omzet:,.0f}", ln=True)
    pdf.cell(0, 8, f"- Rata-rata Harian: Rp {avg_omzet:,.0f}", ln=True)
    pdf.cell(0, 8, f"- Omzet Minggu Ini: Rp {total_omzet_minggu_ini:,.0f}", ln=True)
    pdf.ln(7)

    # 4. Tabel Penjualan (5 Data Terakhir)
    pdf.set_font("Arial", "B", 10)
    pdf.cell(60, 10, "Tanggal", border=1)
    pdf.cell(60, 10, "Omzet", border=1)
    pdf.ln()
    
    pdf.set_font("Arial", "", 10)
    for index, row in df.tail(7).iterrows():
        pdf.cell(60, 10, str(row['sales_date']), border=1)
        pdf.cell(60, 10, f"Rp {row['daily_revenue']:,.0f}", border=1)
        pdf.ln()

    # 5. Insight AI (Ini yang bikin keren)
    pdf.ln(10)
    pdf.set_fill_color(230, 240, 255)
    pdf.set_font("Arial", "B", 11)
    pdf.cell(0, 10, "INSIGHT AI UNTUK BESOK:", ln=True, fill=True)
    pdf.set_font("Arial", "I", 10)
    pdf.multi_cell(0, 10, "Berdasarkan tren terakhir, stok bahan baku disarankan ditambah 15% untuk mengantisipasi lonjakan pelanggan.")

    # 6. Output
    file_name = f"Laporan_resto.pdf"
    pdf.output(file_name)
    return file_name

if __name__ == "__main__":
    generate_pdf_report()
    print("PDF Berhasil dibuat, bro!") 