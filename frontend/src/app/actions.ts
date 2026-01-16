"use server"
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { revalidatePath } from 'next/cache';

const execPromise = promisify(exec);

export async function processUWorldUpload(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { success: false };
  const homeDir = process.env.HOME;
  const pythonPath = path.join(homeDir!, 'ShelfAI/venv/bin/python3');
  const scriptPath = path.join(homeDir!, 'ShelfAI/backend_main.py');
  
  try {
    await execPromise(`${pythonPath} ${scriptPath} "${file.name}"`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function askEmma(question: string) {
  const homeDir = process.env.HOME;
  const pythonPath = path.join(homeDir!, 'ShelfAI/venv/bin/python3');
  const chatScript = path.join(homeDir!, 'ShelfAI/emma_chat.py');
  try {
    await execPromise(`${pythonPath} ${chatScript} "${question}"`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteAnalysis(fileName: string) {
  const outputDir = path.join(process.env.HOME!, 'Desktop/ShelfAI_Output');
  const baseName = fileName.replace('.mp3', '');
  
  try {
    // Delete the MP3
    const mp3Path = path.join(outputDir, fileName);
    if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);
    
    // Delete the Transcript TXT
    const txtPath = path.join(outputDir, `${baseName}_analysis.txt`);
    if (fs.existsSync(txtPath)) fs.unlinkSync(txtPath);
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
