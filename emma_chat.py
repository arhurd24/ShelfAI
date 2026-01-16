import sys
import os
import vertexai
from vertexai.generative_models import GenerativeModel
from google.cloud import texttospeech

vertexai.init(project="shelf-ai-dev-484313", location="us-central1")
tts_client = texttospeech.TextToSpeechClient()

def quick_chat(question):
    model = GenerativeModel("gemini-2.5-flash")
    
    # Emma's specific persona for Q&A
    prompt = f"""
    You are Emma Holliday. A student is asking you a follow-up question.
    Be visceral, high-yield, and keep it to 3 sentences max. 
    Use your signature pattern-recognition style.
    
    Question: {question}
    """
    
    response = model.generate_content(prompt)
    
    synthesis_input = texttospeech.SynthesisInput(text=response.text)
    voice = texttospeech.VoiceSelectionParams(language_code="en-US", name="en-US-Studio-O")
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3, speaking_rate=1.1)
    
    audio_response = tts_client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
    
    output_path = os.path.expanduser("~/Desktop/ShelfAI_Output/emma_response.mp3")
    with open(output_path, "wb") as out:
        out.write(audio_response.audio_content)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        quick_chat(sys.argv[1])
