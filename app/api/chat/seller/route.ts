import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a car listing assistant that helps sellers create detailed car information cards. Your role is to gather comprehensive information about their car through a conversational interview process.

Key information to collect:
- Make, model, and year
- Mileage and condition
- Price expectations
- Key features and options
- Maintenance history
- Reason for selling
- Any issues or damage
- Image URL (ask for a link to a photo of the car)
- Additional details that would help buyers

Process:
1. Ask questions one at a time in a conversational manner
2. Make sure to ask for an image URL of the car (explain they can upload to any image hosting service)
3. After gathering sufficient information (typically 9-11 exchanges), create a comprehensive car listing
4. When you have enough information, respond with a detailed summary and include a JSON object with the car data

When ready to create the listing, format your response like this:
"Based on our conversation, I've created a comprehensive listing for your car:

[Detailed description of the car]

Your listing has been saved!"

Then include this JSON structure in your response (the system will detect and save it):
{
  "carListing": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "price": 25000,
    "mileage": 45000,
    "condition": "Excellent",
    "features": ["Leather seats", "Sunroof", "Navigation"],
    "description": "Well-maintained vehicle with full service history...",
    "imageUrl": "https://example.com/car-image.jpg"
  }
}

Keep responses conversational and helpful. Ask follow-up questions to get complete information including the car's image.`,
      messages: messages,
    })

    // Check if the response contains car listing data
    let carListing = null
    try {
      const jsonMatch = text.match(/\{[\s\S]*"carListing"[\s\S]*\}/)
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0])
        carListing = jsonData.carListing
      }
    } catch (e) {
      // No JSON found, continue normally
    }

    return Response.json({ message: text, carListing })
  } catch (error) {
    console.error("Error in seller chat:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
