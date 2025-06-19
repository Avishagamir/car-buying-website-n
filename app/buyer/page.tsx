"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Send,
  Bot,
  User,
  LogOut,
  MessageCircle,
  Sparkles,
  Zap,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  CheckCircle,
} from "lucide-react"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface CarRecommendation {
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
  contact: {
    name: string
    phone: string
    email: string
    location: string
  }
}

export default function BuyerDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "שלום ובברכה! 👋 אני דני, היועץ הדיגיטלי שלך לרכישת רכבים! 🚗\n\nאני כאן כדי לעזור לך למצוא את הרכב המושלם בדיוק בשבילך - כזה שיתאים לצרכים שלך, לתקציב ולסגנון החיים שלך.\n\nבואו נכיר! איך קוראים לך? ומה מביא אותך לחפש רכב חדש? 😊",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [recommendationsCount, setRecommendationsCount] = useState(0)
  const [isLimitReached, setIsLimitReached] = useState(false)
  const [carRecommendations, setCarRecommendations] = useState<CarRecommendation[]>([])
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [savedRecommendations, setSavedRecommendations] = useState<CarRecommendation[]>([])

  // טעינת מספר ההמלצות מ-localStorage
  useEffect(() => {
    // טעינת מספר ההמלצות מ-localStorage
    const savedCount = localStorage.getItem("recommendationsCount")
    if (savedCount) {
      const count = Number.parseInt(savedCount)
      setRecommendationsCount(count)
      if (count >= 2) {
        setIsLimitReached(true)
      }
    }

    // טעינת היסטוריית הצ'אט מ-localStorage
    const savedChatHistory = localStorage.getItem("chatHistory")
    if (savedChatHistory) {
      try {
        const parsedHistory = JSON.parse(savedChatHistory)
        const historyWithDates = parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(historyWithDates)
        setChatHistory(historyWithDates)
      } catch (error) {
        console.error("Error loading chat history:", error)
      }
    }

    // טעינת המלצות שמורות מ-localStorage
    const savedRecs = localStorage.getItem("savedRecommendations")
    if (savedRecs) {
      try {
        const parsedRecs = JSON.parse(savedRecs)
        setSavedRecommendations(parsedRecs)
        setCarRecommendations(parsedRecs)
      } catch (error) {
        console.error("Error loading saved recommendations:", error)
      }
    }
  }, [])

  // שמירת מספר ההמלצות ב-localStorage כשהוא משתנה
  useEffect(() => {
    localStorage.setItem("recommendationsCount", recommendationsCount.toString())
    if (recommendationsCount >= 2) {
      setIsLimitReached(true)
    }
  }, [recommendationsCount])

  // הוסף useEffect חדש לשמירת היסטוריה
  useEffect(() => {
    if (messages.length > 1) {
      // שמור רק אם יש יותר מהודעת הפתיחה
      localStorage.setItem("chatHistory", JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (carRecommendations.length > 0) {
      localStorage.setItem("savedRecommendations", JSON.stringify(carRecommendations))
    }
  }, [carRecommendations])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, carRecommendations])

  const handleSendMessage = async () => {
    if (!input.trim() || loading || isLimitReached) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat/buyer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          recommendationsCount: recommendationsCount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // עדכון מספר ההמלצות רק אם נמצאו רכבים
      if (data.foundCars) {
        const newCount = data.recommendationsCount || recommendationsCount + 1
        setRecommendationsCount(newCount)
        setCarRecommendations(data.carRecommendations || [])
        localStorage.setItem("recommendationsCount", newCount.toString())
      }

      if (data.isLimitReached) {
        setIsLimitReached(true)
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleContactSeller = (contact: any) => {
    // כאן לא נעשה כלום - רק הודעה
    router.push("/car-purchased")
  }

  const quickSuggestions = [
    "I'm looking for a family SUV under $40k",
    "Show me fuel-efficient sedans",
    "I need a truck for work",
    "What's the best luxury car for $60k?",
  ]

  const resetData = () => {
    localStorage.removeItem("recommendationsCount")
    localStorage.removeItem("chatHistory")
    localStorage.removeItem("savedRecommendations")
    setRecommendationsCount(0)
    setIsLimitReached(false)
    setCarRecommendations([])
    setSavedRecommendations([])
    setMessages([
      {
        id: "1",
        content:
          "שלום ובברכה! 👋 אני דני, היועץ הדיגיטלי שלך לרכישת רכבים! 🚗\n\nאני כאן כדי לעזור לך למצוא את הרכב המושלם בדיוק בשבילך - כזה שיתאים לצרכים שלך, לתקציב ולסגנון החיים שלך.\n\nבואו נכיר! איך קוראים לך? ומה מביא אותך לחפש רכב חדש? 😊",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Buyer Dashboard
                </h1>
                <p className="text-sm text-gray-600">Find your perfect car with AI assistance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                AI Assistant Active
              </Badge>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className=" mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Assistant Info */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI Assistant</h3>
                    <p className="text-blue-100 text-sm">Powered by GPT-4</p>
                  </div>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed">
                  I'll help you find the perfect car by understanding your needs, budget, and preferences.
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Quick Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(suggestion)}
                    className="w-full text-left justify-start h-auto p-3 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <span className="text-sm">{suggestion}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Chat Stats */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">המלצות רכבים</span>
                  </div>
                  <Badge variant="secondary">{recommendationsCount}/2</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Reset Button - רק לבדיקות */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <Button
                  onClick={resetData}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-red-200 hover:border-red-300 hover:bg-red-50"
                >
                  איפוס נתונים (לבדיקות)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-200px)] shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  AI Car Buying Assistant
                  <div className="ml-auto flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm text-blue-100">Online</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={flex ${message.role === "user" ? "justify-end" : "justify-start"}}
                      >
                        <div
                          className={flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}}
                        >
                          <Avatar
                            className={`h-10 w-10 ${
                              message.role === "user" ? "ml-3" : "mr-3"
                            } shadow-lg border-2 border-white`}
                          >
                            <AvatarFallback
                              className={
                                message.role === "user"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              }
                            >
                              {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`p-4 rounded-2xl shadow-lg ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                : "bg-white border border-gray-200 text-gray-900"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            <p
                              className={text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Car Recommendations */}
                    {carRecommendations.length > 0 && (
                      <div className="space-y-4">
                        {carRecommendations.map((car, index) => {
                          const features = []
                          if (car["4x4"]) features.push("4X4")
                          if (car.economical) features.push("חסכוני")
                          if (car.cruise_control) features.push("בקרת שיוט")
                          if (car.distance_control) features.push("בקרת מרחק")
                          if (car.adaptive_cruise_control) features.push("בקרת שיוט אדפטיבית")
                          if (car.magnesium_wheels) features.push("חישוקי מגנזיום")

                          return (
                            <Card
                              key={index}
                              className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 overflow-hidden"
                            >
                              <div className="relative">
                                <div className="absolute top-4 right-4 z-10">
                                  <Badge className="bg-green-600 text-white px-3 py-1 text-lg font-bold">
                                    {car.price.toLocaleString()}₪
                                  </Badge>
                                </div>
                                <div className="absolute top-4 left-4 z-10">
                                  <Badge variant="secondary" className="bg-black/70 text-white px-2 py-1">
                                    {car.year}
                                  </Badge>
                                </div>
                                <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                                  <img
                                    src={/placeholder.svg?height=200&width=400&text=${encodeURIComponent(car.car_name)}}
                                    alt={car.car_name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>

                              <CardContent className="p-6">
                                <div className="mb-4">
                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{car.car_name}</h3>
                                  <div className="flex items-center text-gray-600 mb-4">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span className="mr-4">{car.year}</span>
                                    <Settings className="h-4 w-4 mr-2" />
                                    <span className="mr-4">יד {car.hand_num}</span>
                                    {car.valid_test && (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                        <span>טסט תקף</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{car.horse_power}</div>
                                    <div className="text-sm text-gray-600">כוח סוס</div>
                                  </div>
                                  <div className="bg-green-50 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-green-600">{car.engine_volume}L</div>
                                    <div className="text-sm text-gray-600">נפח מנוע</div>
                                  </div>
                                </div>

                                <div className="mb-6">
                                  <div className="flex items-center mb-2">
                                    <Fuel className="h-4 w-4 mr-2 text-gray-600" />
                                    <span className="text-gray-700 font-medium">סוג דלק: {car.fuel_type}</span>
                                  </div>
                                  <div className="flex items-center mb-4">
                                    <Badge
                                      variant="outline"
                                      className={mr-2 ${car.brand_group === "Luxury" ? "border-purple-300 text-purple-700" : "border-blue-300 text-blue-700"}}
                                    >
                                      {car.brand_group}
                                    </Badge>
                                  </div>
                                </div>

                                {features.length > 0 && (
                                  <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">תכונות מיוחדות:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {features.map((feature, featureIndex) => (
                                        <Badge
                                          key={featureIndex}
                                          variant="secondary"
                                          className="bg-gray-100 text-gray-700"
                                        >
                                          {feature}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="border-t border-gray-200 pt-6">
                                  <h4 className="font-semibold text-gray-900 mb-3">פרטי המוכר:</h4>
                                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <div className="flex items-center mb-2">
                                      <User className="h-4 w-4 mr-2 text-gray-600" />
                                      <span className="font-medium">{car.contact.name}</span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                      <Phone className="h-4 w-4 mr-2 text-gray-600" />
                                      <span>{car.contact.phone}</span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                      <Mail className="h-4 w-4 mr-2 text-gray-600" />
                                      <span>{car.contact.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                                      <span>{car.contact.location}</span>
                                    </div>
                                  </div>

                                  <Button
                                    onClick={() => handleContactSeller(car.contact)}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                  >
                                    <Phone className="h-4 w-4 mr-2" />
                                    יצירת קשר עם המוכר
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="flex">
                          <Avatar className="h-10 w-10 mr-3 shadow-lg border-2 border-white">
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-lg">
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                              <div
                                className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  {isLimitReached ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">הגעת למגבלת ההמלצות החינמיות</p>
                      <Button
                        onClick={() => router.push("/pro-subscription")}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        שדרג למנוי PRO
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex space-x-3">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Type your message about cars, budget, preferences..."
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          disabled={loading}
                          className="flex-1 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={loading || !input.trim()}
                          className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Press Enter to send • המלצות רכבים נותרות: {2 - recommendationsCount}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
