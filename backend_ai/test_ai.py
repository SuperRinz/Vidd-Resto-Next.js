from google import genai

client = genai.Client(api_key="AIzaSyB4XwRM79dwATnAdmfSZLJzDzW_PkY_iwQ")

response = client.models.generate_content(
    model="gemini-flash-latest",
    contents="coba kasih jokes indo yang lu tau, sama kasih top 3 lagu indo favorit lu"
)

print(response.text)