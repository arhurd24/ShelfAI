import os
import sys
from google.cloud import firestore, texttospeech
import vertexai
from vertexai.generative_models import GenerativeModel

# Setup
PROJECT_ID = "shelf-ai-dev-484313"
vertexai.init(project=PROJECT_ID, location="us-central1")
db = firestore.Client(project=PROJECT_ID)
tts_client = texttospeech.TextToSpeechClient()

OUTPUT_DIR = os.path.expanduser("~/Desktop/ShelfAI_Output")
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def generate_study_session(student_id, filename):
    topic = os.path.splitext(filename)[0]
    model = GenerativeModel("gemini-2.5-flash")
    
    # --- PROMPT 1: THE HARVARD HONORS TEXT ANALYSIS ---
    text_prompt = f"""
    PSYCHIATRY SHELF WRONG QUESTION ANALYSIS - HARVARD HONORS STANDARD
    You are a top Harvard professor whose students consistently HONOR their shelf exams.
    Every analysis must be approved by Pestana and Emma. 10/10 only.
    
    TOPIC: {topic}
    
    FOLLOW THESE SECTIONS STRICTLY:
    1. KEY PRINCIPLE: 2-3 sentences MAX.
    2. TRAPS: Exactly 4 traps. Visceral language ("destroys", "classic bait"). 3 sentences MAX per trap.
    3. STEM CLUES: 5-7 clues MAX. Bold exact words from stem.
    4. ONE KILLER TABLE: Single differential, 4-5 rows MAX. 
    5. ANSWER CHOICES: Detailed 'Your Wrong Answer' psychology. 1 sentence for other wrongs.
    6. CLINICAL PEARLS: 5 MAX. Format "X vs Y: discriminator".
    7. FIX BOX: Formula (1 sentence), Memory Aid (<=10 words), For Rounds (4-5 sentences).
    
    TOTAL LENGTH: 800-1,100 words. Pattern recognition > memorization.
    """

    # --- PROMPT 2: THE EMMA HOLLIDAY AUDIO SCRIPT ---
    audio_prompt = f"""
    PSYCHIATRY SHELF AUDIO SCRIPTS - HARVARD HONORS LEARNING MODE
    You are Emma Holliday teaching with Pestana's depth and clarity.
    Students are LEARNING—this is primary study material. Teach the WHY.
    
    TOPIC: {topic}

    STRUCTURE:
    1. THE PATTERN (1-2 sentences, <=30 words).
    2. STEM BREAKDOWN (6-8 bullets, arrow format).
    3. THE TRAP (5-6 sentences). Visceral psychology of the error.
    4. RAPID ELIMINATION (2-3 sentences per answer).
    5. TOP 5 SHELF FACTS (3-4 sentences each, ends with 'Pattern: [takeaway]').
    6. CLINICAL DECISION (3-4 bullets).
    7. BOARD RECALL (1-2 sentences, <=35 words).
    
    TOTAL LENGTH: 900-1,100 words. No markdown (stars/hashes).
    """

    print(f"--- 🧠 Engine 1: Generating Harvard Text Analysis ---")
    text_response = model.generate_content(text_prompt)
    
    print(f"--- 🧠 Engine 2: Generating Emma Audio Script ---")
    audio_response = model.generate_content(audio_prompt)

    # Save Text Analysis
    text_path = os.path.join(OUTPUT_DIR, f"{topic}_analysis.txt")
    with open(text_path, "w") as f:
        f.write(text_response.text)

    # Voice Generation (Emma Holliday Persona)
    print(f"--- 🎙️ Synthesizing Emma's Voice ---")
    clean_audio_text = audio_response.text.replace("*", "").replace("#", "").replace("- ", "")
    
    synthesis_input = texttospeech.SynthesisInput(text=clean_audio_text[:4800]) 
    voice = texttospeech.VoiceSelectionParams(language_code="en-US", name="en-US-Studio-O")
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3, speaking_rate=1.08)
    
    response = tts_client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    audio_path = os.path.join(OUTPUT_DIR, f"{topic}.mp3")
    with open(audio_path, "wb") as out:
        out.write(response.audio_content)
    
    print(f"✅ Success: Analysis and Audio created for {topic}")

if __name__ == "__main__":
    user_filename = sys.argv[1] if len(sys.argv) > 1 else "General_Analysis"
    generate_study_session("aaron_dev", user_filename)
