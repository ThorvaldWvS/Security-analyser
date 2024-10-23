import Tesseract from 'tesseract.js';

export async function processImageFile(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please upload an image file.');
  }

  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeInBytes) {
    throw new Error('File size too large. Please upload an image smaller than 10MB.');
  }

  try {
    const { data: { text } } = await Tesseract.recognize(file, 'eng', {
      logger: () => {}, // Disable console logging
    });

    if (!text.trim()) {
      throw new Error('No text could be extracted from the image');
    }

    return text;
  } catch (error) {
    throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function processEmailFile(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  const validTypes = ['text/plain', 'message/rfc822', 'application/email'];
  if (!validTypes.includes(file.type) && !file.name.endsWith('.eml')) {
    throw new Error('Invalid file type. Please upload a .txt or .eml file.');
  }

  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    throw new Error('File size too large. Please upload an email file smaller than 5MB.');
  }

  try {
    const text = await file.text();
    
    if (!text.trim()) {
      throw new Error('The email file is empty');
    }

    return text;
  } catch (error) {
    throw new Error(`Failed to process email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}