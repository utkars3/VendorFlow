import dotenv from 'dotenv';
import path from 'path';

// Try loading from default location
const result = dotenv.config();

console.log('--- Environment Variable Check ---');
console.log('Loading .env result:', result.error ? 'Error' : 'Success');
if (result.error) {
    console.error('Error loading .env:', result.error);
}

const key = process.env.GEMINI_API_KEY;
if (key) {
    console.log('GEMINI_API_KEY is set.');
    console.log('Key length:', key.length);
    console.log('Key starts with:', key.substring(0, 4) + '...');
} else {
    console.error('GEMINI_API_KEY is NOT set.');
}

console.log('Current Directory:', process.cwd());
console.log('----------------------------------');
