import os, shutil, csv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import vertexai
from vertexai.generative_models import GenerativeModel
from google.cloud import texttospeech, storage

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# --- CONFIGURATION ---
PROJECT_ID = "shelf-ai-dev-484313"
BUCKET_NAME = "shelf-ai-public-assets" # You will create this in the next step
vertexai.init(project=PROJECT_ID, location="us-central1")

storage_client = storage.Client()
tts_client = texttospeech.TextToSpeechClient()

@app.post("/upload")
async def upload_to_cloud(file: UploadFile = File(...)):
    topic = os.path.splitext(file.filename)[0]
    
    # 1. Brain: Gemini 2.0 Flash
    model = GenerativeModel("gemini-2.0-flash-exp")
    response = model.generate_content(f"Analyze for Medical Shelf: {topic}")
    
    # 2. Voice: TTS
    synthesis_input = texttospeech.SynthesisInput(text=response.text[:4800])
    voice = texttospeech.VoiceSelectionParams(language_code="en-US", name="en-US-Studio-O")
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    audio_res = tts_client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    # 3. Storage: Save to Google Cloud Bucket instead of Desktop
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(f"audios/{topic}.mp3")
    blob.upload_from_string(audio_res.audio_content, content_type="audio/mpeg")
    
    # Make it public so Vercel can play it
    blob.make_public()

    return {
        "name": file.filename,
        "audioUrl": blob.public_url,
        "status": "Ready"
    }
