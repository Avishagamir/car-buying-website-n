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
  Plus,
  Share,
  MessageCircle,
  Sparkles,
  BarChart3,
  Eye,
  Calendar,
  DollarSign,
} from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface CarListing {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  condition: string
  features: string[]
  description: string
  imageUrl?: string
  createdAt: Date
}

export default function SellerDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm here to help you create a detailed car listing. I'll ask you a series of questions about your car to generate a comprehensive information card. Let's start: What is the make and model of your car?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState<CarListing[]>([])
  const [showChat, setShowChat] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        console.log("No user logged in")
        return
      }

      console.log("Loading listings for user:", user.uid)
      const q = query(collection(db, "listings"), where("sellerId", "==", user.uid))
      const querySnapshot = await getDocs(q)
      const loadedListings: CarListing[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log("Found listing:", data)
        loadedListings.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as CarListing)
      })

      // מיון לפי תאריך יצירה (החדשים ביותר קודם)
      loadedListings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      console.log("Total listings loaded:", loadedListings.length)
      setListings(loadedListings)
    } catch (error) {
      console.error("Error loading listings:", error)
    }
  }

  // נוסיף גם useEffect שיטען את המודעות כשהמשתמש מתחבר:
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User authenticated, loading listings")
        loadListings()
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

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
      const response = await fetch("/api/chat/seller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
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

      // Check if we have a car listing to save
      if (data.carListing) {
        await saveCarListing(data.carListing)
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

  const saveCarListing = async (carData: any) => {
    try {
      const user = auth.currentUser
      if (!user) return

      const listing = {
        ...carData,
        sellerId: user.uid,
        createdAt: new Date(),
      }

      await addDoc(collection(db, "listings"), listing)
      await loadListings()
    } catch (error) {
      console.error("Error saving listing:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const startNewListing = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hello! I'm here to help you create a detailed car listing. I'll ask you a series of questions about your car to generate a comprehensive information card. Let's start: What is the make and model of your car?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
    setShowChat(true)
  }

  const shareToWhatsApp = (listing: CarListing) => {
    const message = `🚗 *${listing.year} ${listing.make} ${listing.model}*

💰 Price: $${listing.price?.toLocaleString()}
📏 Mileage: ${listing.mileage?.toLocaleString()} miles
⭐ Condition: ${listing.condition}

${listing.description ? `📝 ${listing.description}` : ""}

${listing.features && listing.features.length > 0 ? `🔧 Features: ${listing.features.join(", ")}` : ""}

${listing.imageUrl ? `📸 Image: ${listing.imageUrl}` : ""}

Contact me for more details!`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const totalValue = listings.reduce((sum, listing) => sum + (listing.price || 0), 0)
  const averagePrice = listings.length > 0 ? totalValue / listings.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Seller Dashboard
                </h1>
                <p className="text-sm text-gray-600">Manage your car listings with AI assistance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowChat(!showChat)}
                variant="outline"
                className="border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all"
              >
                {showChat ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Listings
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Create Listing
                  </>
                )}
              </Button>
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

      <div className="max-w-7xl mx-auto p-6">
        {showChat ? (
          /* Chat Interface */
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* AI Assistant Info */}
              <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Listing Assistant</h3>
                      <p className="text-green-100 text-sm">AI-Powered</p>
                    </div>
                  </div>
                  <p className="text-green-100 text-sm leading-relaxed">
                    I'll help you create professional car listings by gathering all the important details.
                  </p>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-4">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-gray-600">Total Listings</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {listings.length}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-gray-600">Avg. Price</span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        ${averagePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[calc(100vh-200px)] shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    Car Listing Assistant
                    <div className="ml-auto flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm text-green-100">Ready to Help</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full p-0">
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <Avatar
                              className={`h-10 w-10 ${
                                message.role === "user" ? "ml-3" : "mr-3"
                              } shadow-lg border-2 border-white`}
                            >
                              <AvatarFallback
                                className={
                                  message.role === "user"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                }
                              >
                                {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`p-4 rounded-2xl shadow-lg ${
                                message.role === "user"
                                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                                  : "bg-white border border-gray-200 text-gray-900"
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                              <p
                                className={`text-xs mt-2 ${
                                  message.role === "user" ? "text-green-100" : "text-gray-500"
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="flex">
                            <Avatar className="h-10 w-10 mr-3 shadow-lg border-2 border-white">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                <Bot className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-lg">
                              <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                                <div
                                  className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
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

                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your car details..."
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        disabled={loading}
                        className="flex-1 h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl bg-white shadow-sm"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={loading || !input.trim()}
                        className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Press Enter to send • AI will guide you through creating your listing
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Listings View */
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Your Car Listings
                </h2>
                <p className="text-gray-600 mt-2">Manage and share your car listings</p>
              </div>
              <Button
                onClick={startNewListing}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Listing
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Listings</p>
                      <p className="text-3xl font-bold">{listings.length}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-r from-green-600 to-green-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Value</p>
                      <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Average Price</p>
                      <p className="text-3xl font-bold">
                        ${averagePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {listings.length === 0 ? (
              <Card className="text-center py-16 shadow-xl border-0 bg-gradient-to-br from-gray-50 to-white">
                <CardContent>
                  <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Car className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No listings yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Create your first car listing with our AI assistant to get started selling your vehicle.
                  </p>
                  <Button
                    onClick={startNewListing}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Listing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((listing) => (
                  <Card
                    key={listing.id}
                    className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-white shadow-lg overflow-hidden"
                  >
                    {listing.imageUrl && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={listing.imageUrl || "/placeholder.svg"}
                          alt={`${listing.year} ${listing.make} ${listing.model}`}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=200&width=300&text=No Image"
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {listing.year}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                          ${listing.price?.toLocaleString()}
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {listing.year} {listing.make} {listing.model}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-gray-900">${listing.price?.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Price</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-gray-900">{listing.mileage?.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Miles</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Condition:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border border-green-200">
                          {listing.condition}
                        </Badge>
                      </div>

                      {listing.features && listing.features.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600 block mb-2">Features:</span>
                          <div className="flex flex-wrap gap-2">
                            {listing.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-gray-300">
                                {feature}
                              </Badge>
                            ))}
                            {listing.features.length > 3 && (
                              <Badge variant="outline" className="text-xs border-gray-300">
                                +{listing.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {listing.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{listing.description}</p>
                      )}

                      <div className="pt-4 border-t border-gray-200">
                        <Button
                          onClick={() => shareToWhatsApp(listing)}
                          variant="outline"
                          size="sm"
                          className="w-full border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all"
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share on WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
