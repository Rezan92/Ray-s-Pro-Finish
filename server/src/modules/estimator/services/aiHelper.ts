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

interface ServiceBlueprint {
	rules: string[];
	examples: string;
}

const SERVICE_BLUEPRINTS: Record<string, ServiceBlueprint> = {
	painting: {
		rules: [
			"Group rooms if they have the same surfaces selected (e.g., 'walls and ceilings in Bedroom 1 and 2').",
			'Mention the professional 2-coat finish, furniture protection, and daily clean-up.',
			"If unique surfaces like 'Trim' or 'Doors' are selected for only one room, mention them separately.",
		],
		examples: `
            EXAMPLE INPUT:
            Name: John, Time: 2 days, Data: { rooms: [{ label: "Bedroom 1", surfaces: { walls: true } }, { label: "Bedroom 2", surfaces: { walls: true } }] }
            EXAMPLE OUTPUT:
            "Hi John, thank you for using our free estimator! This estimate covers a professional 2-coat finish on the walls for Bedroom 1 and Bedroom 2. We expect this project to take approximately 2 days to complete. Every project includes full floor protection and a spotless daily clean-up. Best regards, Ray's Pro Finish."
        `,
	},
	patching: {
		rules: [
			"Group repairs by location name (e.g., 'various repairs in the Living Room').",
			'Mention seamless texture matching (Orange Peel, Knockdown, etc.) as a key value point.',
			'Mention dust containment and surface preparation.',
			'Be specific about the types of damage (holes, cracks, water damage).',
		],
		examples: `
            EXAMPLE INPUT:
            Name: Sarah, Time: 1 day, Data: { repairs: [{ locationName: "Living Room", damageType: "Large Hole", texture: "Orange Peel" }, { locationName: "Living Room", damageType: "Stress Crack", texture: "Orange Peel" }] }
            EXAMPLE OUTPUT:
            "Hi Sarah, thank you for using our free estimator! This estimate covers professional drywall repairs in your Living Room, specifically addressing the large hole and stress cracks with seamless Orange Peel texture matching. We expect this project to take approximately 1 day to complete. We prioritize dust containment and a clean workspace. Best regards, Ray's Pro Finish."
        `,
	},
	installation: {
		rules: [
			'Mention specific rooms receiving new drywall.',
			'Highlight the level of finish (e.g., Level 4 smooth) and readiness for paint.',
		],
		examples: `
            EXAMPLE INPUT:
            Name: Mike, Time: 5 days, Data: { areas: ["Garage", "Basement Storage"] }
            EXAMPLE OUTPUT:
            "Hi Mike, thank you for using our free estimator! This estimate covers the full installation and finishing of new drywall in your Garage and Basement Storage areas to a paint-ready smooth finish. We expect this project to take approximately 5 days to complete. Best regards, Ray's Pro Finish."
        `,
	},
};

export const generateCustomerSummary = async (
	formData: any,
	totalHours: number
) => {
	const customerName = formData.contact?.name || 'there';
	const estimatedDays = Math.ceil(totalHours / 8);
	const dayText = estimatedDays === 1 ? '1 day' : `${estimatedDays} days`;

	const activeService =
		Object.keys(formData.services || {}).find(
			(key) => formData.services[key] === true
		) || 'painting';

	const blueprint =
		SERVICE_BLUEPRINTS[activeService] || SERVICE_BLUEPRINTS.painting;

	if (!blueprint || !blueprint.rules) {
		return `Hi ${customerName}, thank you for using our free estimator! We expect your project to take approximately ${dayText}. Best regards, Ray's Pro Finish.`;
	}

	const prompt = `
        You are the Lead Estimator at Ray's Pro Finish. Write a professional, concise summary for the customer.

        CORE RULES:
        1. Start with "Hi ${customerName}, thank you for using our free estimator!"
        2. Mention time: "We expect this project to take approximately ${dayText} to complete."
        3. END with "Best regards, Ray's Pro Finish"
        4. NEVER mention technical square footage or specific prices.
        5. IMPORTANT: Group items logically. Do not list rooms/repairs one by one if they are similar.

        ${activeService.toUpperCase()} SPECIFIC RULES:
        ${blueprint.rules
					.map((rule, index) => `${index + 1}. ${rule}`)
					.join('\n')}

        FOLLOW THIS GROUPING STYLE:
        ${blueprint.examples}

        NOW GENERATE THE SUMMARY FOR THIS CUSTOMER DATA:
        Service: ${activeService}
        Project Data: ${JSON.stringify(
					formData[activeService] || formData,
					null,
					2
				)}
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

		const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
		return textResponse
			? textResponse.trim()
			: 'Thank you for your request. We will contact you shortly.';
	} catch (error) {
		console.error('AI Summary Error:', error);
		return `Hi ${customerName}, thank you for using our free estimator! We estimate your ${activeService} project will take about ${dayText}. Best regards, Ray's Pro Finish.`;
	}
};
