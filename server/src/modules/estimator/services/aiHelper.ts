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

export const generateCustomerSummary = async (
	formData: any,
	totalHours: number
) => {
	const customerName = formData.contact?.name || 'there';

	// Calculate days based on 8-hour workday
	const estimatedDays = Math.ceil(totalHours / 8);
	const dayText = estimatedDays === 1 ? '1 day' : `${estimatedDays} days`;

	const prompt = `
        You are the Lead Estimator at Ray's Pro Finish. Your task is to write a CONCISE, professional summary of a painting estimate. 

        RULES:
        1. Start with "Hi [Name], thank you for using our free estimator!"
        2. Group rooms if they have the same surfaces selected.
        3. Mention unique surfaces separately.
        4. Mention the estimated time: "We expect this project to take approximately ${dayText} to complete."
        5. Mention standard quality: "This includes a professional 2-coat finish, full furniture/floor protection, and a spotless daily clean-up."
        6. DO NOT mention technical details, square footage, or specific prices.
        7. END with "Best regards, Ray's Pro Finish"
        8. KEEP IT SHORT.

        EXAMPLE INPUT:
        Rooms: [{ label: "Bedroom 1", surfaces: { walls: true } }, { label: "Bedroom 2", surfaces: { walls: true } }]
        Name: John
        Time: 2 days

        EXAMPLE OUTPUT:
        "Hi John, thank you for using our free estimator! This estimate covers a professional 2-coat finish on the walls for Bedroom 1 and Bedroom 2. We expect this project to take approximately 2 days to complete. Every project includes full floor protection and a spotless daily clean-up. Best regards, Ray's Pro Finish."

        NOW GENERATE THE SUMMARY FOR:
        User Name: ${customerName}
        Project Details: ${JSON.stringify(formData, null, 2)}
        Calculated Time: ${dayText}
    `;

	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
			}),
		});

		const data = await response.json();
		return data.candidates[0].content.parts[0].text.trim();
	} catch (error) {
		console.error('AI Summary Error:', error);
		return `Hi ${customerName}, thank you for using our free estimator! We have calculated your range and expect it to take about ${dayText}. Please book a walkthrough to finalize the details. Best regards, Ray's Pro Finish.`;
	}
};
