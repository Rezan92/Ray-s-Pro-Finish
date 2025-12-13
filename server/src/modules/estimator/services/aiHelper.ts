import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
	console.error('❌ GEMINI_API_KEY is missing in server .env file');
}

export const callGemini = async (prompt: string) => {
	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
				generationConfig: {
					responseMimeType: 'application/json',
					responseSchema: {
						type: 'OBJECT',
						properties: {
							low: { type: 'NUMBER' },
							high: { type: 'NUMBER' },
							explanation: { type: 'STRING' },
							totalHours: { type: 'NUMBER' },
						},
						required: ['low', 'high', 'explanation', 'totalHours'],
					},
				},
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Gemini API Error: ${response.statusText} - ${errorText}`
			);
		}

		const data = await response.json();
		const jsonText = data.candidates[0].content.parts[0].text;
		return JSON.parse(jsonText);
	} catch (error) {
		console.error('AI Service Error:', error);
		throw error;
	}
};
