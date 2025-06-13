import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { promises as fs } from "fs"
import path from "path"

interface CarData {
  brand: string
  model: string
  car_name: string
  price: number
  year: number
  hand_num: number
  horse_power: number
  "4x4": number
  fuel_type: string
  engine_volume: number
  valid_test: number
  magnesium_wheels: number
  distance_control: number
  economical: number
  adaptive_cruise_control: number
  cruise_control: number
  brand_normalized: string
  brand_group: string
}

const contactDetails = [
  {
    name: "יוסי כהן",
    phone: "050-1234567",
    email: "yossi.cohen@example.com",
    location: "תל אביב",
  },
  {
    name: "שרה לוי",
    phone: "052-9876543",
    email: "sarah.levi@example.com",
    location: "חיפה",
  },
  {
    name: "דוד רוזן",
    phone: "054-5555555",
    email: "david.rosen@example.com",
    location: "ירושלים",
  },
  {
    name: "מיכל אברהם",
    phone: "053-7777777",
    email: "michal.avraham@example.com",
    location: "באר שבע",
  },
  {
    name: "אבי גולדברג",
    phone: "050-9999999",
    email: "avi.goldberg@example.com",
    location: "נתניה",
  },
]

async function loadCarData(): Promise<CarData[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "cars.csv")
    const fileContent = await fs.readFile(filePath, "utf-8")
    const lines = fileContent.trim().split("\n")
    const headers = lines[0].split(",")

    const cars: CarData[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",")
      const car: any = {}

      headers.forEach((header, index) => {
        const value = values[index]
        if (
          header === "price" ||
          header === "year" ||
          header === "hand_num" ||
          header === "horse_power" ||
          header === "engine_volume"
        ) {
          car[header] = Number.parseFloat(value) || 0
        } else if (
          header === "4x4" ||
          header === "valid_test" ||
          header === "magnesium_wheels" ||
          header === "distance_control" ||
          header === "economical" ||
          header === "adaptive_cruise_control" ||
          header === "cruise_control"
        ) {
          car[header] = Number.parseInt(value) || 0
        } else {
          car[header] = value
        }
      })

      cars.push(car as CarData)
    }

    return cars
  } catch (error) {
    console.error("Error loading car data:", error)
    return []
  }
}

function findMatchingCars(cars: CarData[], preferences: string): CarData[] {
  // נחזיר רכב אחד רנדומלי
  const shuffled = cars.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 1)
}

function getRandomContact() {
  return contactDetails[Math.floor(Math.random() * contactDetails.length)]
}

// פונקציה לבדיקה אם השלמנו את השאלון
function hasCompletedQuestionnaire(messages: any[]): boolean {
  // נספור כמה הודעות מהמשתמש יש לנו (לא כולל הודעת פתיחה)
  const userMessages = messages.filter((m) => m.role === "user").length

  // נדרוש את כל 9 השאלות לפני המלצה
  return userMessages >= 9
}

// פונקציה לבדיקה אם המשתמש מבקש במפורש המלצת רכב
function isExplicitlyRequestingCar(message: string): boolean {
  const lowerMessage = message.toLowerCase()

  // ביטויים שמעידים על בקשה מפורשת לרכב
  const explicitPhrases = [
    "תראה לי רכב",
    "תמצא לי רכב",
    "אני רוצה לראות רכב",
    "תמליץ לי על רכב",
    "show me a car",
    "find me a car",
    "recommend a car",
    "מה הרכב המתאים לי",
    "איזה רכב מתאים לי",
  ]

  return explicitPhrases.some((phrase) => lowerMessage.includes(phrase))
}

export async function POST(request: Request) {
  try {
    const { messages, recommendationsCount = 0 } = await request.json()

    // בדיקת מגבלת המלצות - נוודא שאנחנו בודקים נכון
    if (recommendationsCount >= 2) {
      return Response.json({
        message: `🚫 הגעת למגבלת ההמלצות החינמיות!

🌟 **שדרג למנוי PRO ותקבל:**
✅ המלצות רכבים ללא הגבלה
✅ גישה למאגר מלא של רכבים
✅ המלצות מתקדמות ומותאמות אישית
✅ השוואת רכבים צד לצד
✅ התראות על רכבים חדשים

💎 **רק 29.90₪ לחודש!**

[לחץ כאן לשדרוג למנוי PRO](/pro-subscription)`,
        isLimitReached: true,
      })
    }

    const userLastMessage = messages[messages.length - 1].content.toLowerCase()

    // בדיקה אם צריך להציג המלצות רכב - רק אם השלמנו את השאלון או שיש בקשה מפורשת
    const completedQuestionnaire = hasCompletedQuestionnaire(messages)

    // נציג המלצות רק אחרי השלמת כל 9 השאלות
    const shouldShowRecommendations = completedQuestionnaire

    if (shouldShowRecommendations) {
      const cars = await loadCarData()
      const matchingCars = findMatchingCars(cars, JSON.stringify(messages))
      const contact = getRandomContact()

      if (matchingCars.length > 0) {
        return Response.json({
          message: "מצאתי עבורך רכב מתאים בהתבסס על הצרכים שלך! 🚗 מה דעתך על האפשרות הזו?",
          recommendationsCount: recommendationsCount + 1,
          foundCars: true,
          carRecommendations: matchingCars.map((car) => ({
            ...car,
            contact: contact,
          })),
        })
      }
    }

    // שיחה רגילה עם הבוט
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are Danny, a friendly and professional car buying consultant. You have years of experience helping people find their perfect car. You're warm, personable, and genuinely care about finding the right match for each customer.

Your personality:
- Warm and welcoming, like a trusted friend
- Professional but not formal
- Use Hebrew naturally and conversationally
- Show genuine interest in the customer's needs
- Use emojis occasionally to be friendly (but not too much)
- Ask follow-up questions to show you're listening

CRITICAL: You MUST complete ALL 9 questions before making any car recommendations. Ask ONE question at a time, and wait for the user's response before moving to the next question. Make sure to ask these questions in a natural, conversational way:

1. כמה פעמים תשתמש/י ברכב בשבוע? (How many times per week will you use the car?)
2. איך היית מתאר/ת את צורת הנהיגה שלך? (רגוע וזהיר/ ממהר ולחוץ/ אוהב להרגיש את הכביש/ עירוני טיפוסי) (How would you describe your driving style?)
3. באילו איזורים בארץ תרבה/י לנהוג? (In which areas of the country will you drive most?)
4. שימוש עיקרי ברכב יהיה ל: (נסיעה עירונית/ נסיעה חוץ עירונית/ נסיעות משפחתיות/ נסיעות עם מטען כבד/ טיולים) (Main car usage will be for?)
5. האם יש מגבלות או דרישות מיוחדות: (חנייה צפופה/ צורך בחיבור נגרר/ תא מטען גדול/ נגישות לנכים/ מקומות לכסא תינוק) (Any special limitations or requirements?)
6. באילו שעות אתה נוסע הכי הרבה? (שעות פקוקות/ שעות רגועות/ שעות לילה) (What hours do you drive most?)
7. עד כמה נוחות הישיבה חשובה לך? (סקלה 1-5) (How important is seating comfort? 1-5)
8. עד כמה חשובה לך חווית הנהיגה? (מאוד חשובה/ חשובה אך לא העיקר/ לא ממש משנה) (How important is the driving experience?)
9. האם רכב חשמלי יכול להיות רלוונטי? (כן/לא) (Could an electric car be relevant?)

Guidelines:
- Be conversational and natural, but ALWAYS follow the questionnaire order
- After each user response, acknowledge their answer before asking the next question
- NEVER skip questions - you must ask all 9 questions in order
- If the user asks for a car recommendation before completing ALL 9 questions, politely explain that you need to complete the questionnaire first to make the best recommendation
- Only after getting answers to ALL 9 questions should you tell the user you're ready to find them the perfect car
- Keep track of which question you're on and make sure to ask them all
- If the user asks for a different car after a recommendation, ask what aspects they'd like to change

Remember: Complete the full questionnaire first, then make recommendations. This ensures the best possible car match for each customer.`,
      messages: messages,
    })

    return Response.json({
      message: text,
    })
  } catch (error) {
    console.error("Error in buyer chat:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
