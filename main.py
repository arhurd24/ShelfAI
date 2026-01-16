import os
import json
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import vertexai
from vertexai.generative_models import GenerativeModel
from google.cloud import texttospeech, storage

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

PROJECT_ID = "shelf-ai-dev-484313"
# --- DEV BUCKET SELECTED ---
BUCKET_NAME = "shelf-ai-dev-assets" 
vertexai.init(project=PROJECT_ID, location="us-central1")

storage_client = storage.Client()
tts_client = texttospeech.TextToSpeechClient()

@app.get("/")
async def root():
    return {"status": "online", "env": "development", "agent": "Emma Holliday"}

@app.get("/files")
async def list_files():
    try:
        bucket = storage_client.bucket(BUCKET_NAME)
        blobs = bucket.list_blobs(prefix="audios/")
        return [{"name": b.name.replace("audios/", ""), "audioUrl": f"https://storage.googleapis.com/{BUCKET_NAME}/{b.name}"} for b in blobs if b.name.endswith(".mp3")]
    except Exception as e:
        return []

@app.post("/upload")
async def upload_to_cloud(file: UploadFile = File(...)):
    topic = os.path.splitext(file.filename)[0]
    model = GenerativeModel("gemini-2.0-flash-exp")
    
    # DEV PROMPT (Let's add the Anki card logic here to test it!)
    prompt = f"""
    You are Emma Holliday. Analyze this medical topic: {topic}.
    1. Provide a high-yield spoken briefing script.
    2. Provide 10 'Front;Back' flashcards formatted as a CSV.
    Output format: 
    [SCRIPT] (text) [/SCRIPT]
    [CARDS] (Front;Back lines) [/CARDS]
    """
    
    response = model.generate_content(prompt)
    full_text = response.text
    
    script = full_text.split("[SCRIPT]")[1].split("[/SCRIPT]")[0].strip()
    cards = full_text.split("[CARDS]")[1].split("[/CARDS]")[0].strip()
    
    synthesis_input = texttospeech.SynthesisInput(text=script[:4800])
    voice = texttospeech.VoiceSelectionParams(language_code="en-US", name="en-US-Studio-O")
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    audio_res = tts_client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    bucket = storage_client.bucket(BUCKET_NAME)
    
    audio_blob = bucket.blob(f"audios/{topic}.mp3")
    audio_blob.upload_from_string(audio_res.audio_content, content_type="audio/mpeg")
    audio_blob.make_public()

    csv_blob = bucket.blob(f"cards/{topic}.csv")
    csv_blob.upload_from_string(cards, content_type="text/csv")
    csv_blob.make_public()

    return {
        "name": file.filename, 
        "audioUrl": audio_blob.public_url,
        "cardsUrl": csv_blob.public_url
    }
