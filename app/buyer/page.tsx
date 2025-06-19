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
        
