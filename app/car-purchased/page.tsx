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
  phone?: string
  distance?: string
  isOpen?: boolean
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
    if (!apiKey) {
      console.error("Missing Google Maps API key")
      return
    }
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
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

    if (!navigator.geolocation) {
      alert("המכשיר לא תומך בזיהוי מיקום. אנא חפש ידנית.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const location = new window.google.maps.LatLng(latitude, longitude)
        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        )

        const request = {
          location,
          radius: 5000,
          keyword: "מוסך בדיקת רכב",
          type: "car_repair",
        }

        service.nearbySearch(request, (results: any[], status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const shops = results.slice(0, 5).map((place) => ({
              name: place.name,
              rating: place.rating || 0,
              address: place.vicinity || "",
              phone: "",
              distance: "",
              isOpen: place.opening_hours?.open_now ?? false,
            }))
            setRepairShops(shops)
          } else {
            alert("לא נמצאו מוסכים בקרבת מקום.")
          }
          setLoading(false)
        })
      },
      (error) => {
        console.warn("שגיאת מיקום:", error.message)
        alert("לא ניתן לאתר מיקום. אנא חפש ידנית לפי כתובת.")
        setLoading(false)
      }
    )
  }

  const openInGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
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
            <Button
              variant="outline"
              onClick={() => router.push("/buyer")}
              className="border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
            >
              חזור לצ'אט
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">מזל טוב! 🎉</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            יצרת קשר עם המוכר בהצלחה! לפני שתתחיל לנהוג, חשוב לבצע בדיקה ראשונית של הרכב כדי לוודא שהכל תקין ובטוח.
          </p>
        </div>

        {/* Car Inspection Checklist */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-2xl">
              <Sparkles className="h-6 w-6 mr-3" />
              בדיקה ראשונית - מה חשוב לבדוק ברכב?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-gray-600 mb-6 text-lg">
              בחר את הבדיקות שחשוב לך לבצע ברכב החדש. זה יעזור לנו למצוא לך מוסכים מתאימים שמתמחים בבדיקות אלו.
            </p>

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
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    מחפש מוסכים מתאימים...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    מצא מוסכים לבדיקה
                  </div>
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                נבחרו {selectedChecks.length} בדיקות • מינימום בדיקה אחת נדרשת
              </p>
            </div>
          </CardContent>
        </Card>

        {/* תוצאות מוסכים מוצגים כאן... (כמו בקוד שלך, אם תרצי שאוסיף שוב תגידי) */}
      </div>
    </div>
  )
}
