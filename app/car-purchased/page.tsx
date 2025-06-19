"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CheckCircle,
  MapPin,
  Star,
  Wrench,
  Clock,
  Phone,
  Navigation,
  ArrowRight,
  Sparkles,
} from "lucide-react"

declare global {
  interface Window {
    google: any
  }
}

interface RepairShop {
  name: string
  rating: number
  address: string
  phone: string
  distance: string
  isOpen: boolean
}

export default function CarPurchasedPage() {
  const router = useRouter()
  const [selectedChecks, setSelectedChecks] = useState<string[]>([])
  const [showRepairShops, setShowRepairShops] = useState(false)
  const [repairShops, setRepairShops] = useState<RepairShop[]>([])
  const [loading, setLoading] = useState(false)

  const carChecks = [
    "בדיקת פנסים קדמיים ואחוריים",
    "בדיקת צמיגים ולחץ אוויר",
    "בדיקת מערכת בלמים",
    "בדיקת נוזלי רכב (שמן, מים, בלמים)",
    "בדיקת מצבר ומערכת חשמל",
    "בדיקת מערכת מיזוג אוויר",
    "בדיקת מגבים ונוזל שמשות",
    "בדיקת מערכת היגוי",
    "בדיקת מערכת פליטה",
    "בדיקת חגורות בטיחות",
    "בדיקת מערכת אזעקה ונעילה",
    "בדיקת מערכת ניווט ובידור",
  ]

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => console.log("Google Maps API loaded")
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const handleCheckToggle = (check: string) => {
    setSelectedChecks((prev) =>
      prev.includes(check) ? prev.filter((c) => c !== check) : [...prev, check]
    )
  }

  const findRepairShops = () => {
    if (!window.google) {
      alert("Google Maps לא נטען עדיין. אנא נסה שוב.")
      return
    }

    setLoading(true)
    setShowRepairShops(true)

    const mockRepairShops: RepairShop[] = [
      {
        name: "מוסך אלון - בדיקות טכניות מקצועיות",
        rating: 4.8,
        address: "רחוב הרצל 45, תל אביב",
        phone: "03-5551234",
        distance: "1.2 ק\"מ",
        isOpen: true,
      },
      {
        name: "מרכז בדיקות BMW מורשה",
        rating: 4.6,
        address: "שדרות רוקח 15, תל אביב",
        phone: "03-5555678",
        distance: "2.1 ק\"מ",
        isOpen: true,
      },
      {
        name: "מוסך דוד - בדיקות מהירות",
        rating: 4.4,
        address: "רחוב יהודה הלוי 23, תל אביב",
        phone: "03-5559876",
        distance: "1.8 ק\"מ",
        isOpen: false,
      },
    ]

    setTimeout(() => {
      setRepairShops(mockRepairShops)
      setLoading(false)
    }, 1500)
  }

  const openInGoogleMaps = (address: string) => {
    const encoded = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ברכות על הרכישה!
                </h1>
                <p className="text-sm text-gray-600">בואו נכין אותך לבדיקה ראשונית של הרכב</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/buyer")}>חזור לצ'אט</Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="shadow-2xl border-0 bg-white/90 mb-8">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-2xl">
              <Sparkles className="h-6 w-6 mr-3" /> בדיקה ראשונית - מה חשוב לבדוק ברכב?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-gray-600 mb-6 text-lg">בחר את הבדיקות שחשוב לך לבצע</p>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {carChecks.map((check, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedChecks.includes(check)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleCheckToggle(check)}
                >
                  <Checkbox
                    checked={selectedChecks.includes(check)}
                    onChange={() => handleCheckToggle(check)}
                    className="order-2"
                  />
                  <label className="cursor-pointer flex-1 order-1 text-right" dir="rtl">
                    {check}
                  </label>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button
                onClick={findRepairShops}
                disabled={selectedChecks.length === 0 || loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-lg font-semibold"
              >
                {loading ? "מחפש מוסכים מתאימים..." : "מצא מוסכים לבדיקה"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {showRepairShops && (
          <Card className="shadow-2xl border-0 bg-white/90">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <Wrench className="h-6 w-6 mr-3" /> מוסכים מומלצים לבדיקה ראשונית
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {repairShops.map((shop, index) => (
                <Card key={index} className="border-2 border-gray-200 hover:border-blue-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                        <div className="flex items-center mb-2">
                          <div className="flex items-center mr-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(shop.rating) ? "text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                            <span className="ml-2 text-gray-600 font-medium">{shop.rating}</span>
                          </div>
                          <Badge className={shop.isOpen ? "bg-green-600" : "bg-gray-500"}>
                            <Clock className="h-3 w-3 mr-1" />
                            {shop.isOpen ? "פתוח עכשיו" : "סגור"}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        {shop.distance}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{shop.address}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{shop.phone}</span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button onClick={() => openInGoogleMaps(shop.address)} className="flex-1 bg-blue-600">
                        <Navigation className="h-4 w-4 mr-2" /> נווט במפות גוגל
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" /> התקשר
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
