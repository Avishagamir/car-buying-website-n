"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, MapPin, Star, Wrench, Clock, Phone, Navigation, ArrowRight, Sparkles } from "lucide-react"

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
  // הוסף בתחילת הקומפוננטה אחרי useState הקיימים
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string>("")

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
    // טעינת Google Maps API
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDZT4USQ-MU6DycIUZGeCLCzklS0TF-8yY&libraries=places`
    script.async = true
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // הוסף useEffect חדש לקבלת מיקום
  useEffect(() => {
    // בקשת מיקום מהמשתמש
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationError("לא ניתן לקבל מיקום. נציג מוסכים כלליים באזור תל אביב.")
          // מיקום ברירת מחדל - תל אביב
          setUserLocation({
            lat: 32.0853,
            lng: 34.7818,
          })
        },
      )
    } else {
      setLocationError("הדפדפן לא תומך בשירותי מיקום.")
      // מיקום ברירת מחדל - תל אביב
      setUserLocation({
        lat: 32.0853,
        lng: 34.7818,
      })
    }
  }, [])

  const handleCheckToggle = (check: string) => {
    setSelectedChecks((prev) => (prev.includes(check) ? prev.filter((c) => c !== check) : [...prev, check]))
  }

  // החלף את הפונקציה הקיימת עם:
  const findRepairShops = () => {
    if (!window.google) {
      alert("Google Maps לא נטען עדיין. אנא נסה שוב.")
      return
    }

    if (!userLocation) {
      alert("לא ניתן לקבל את המיקום שלך. אנא אפשר גישה למיקום ונסה שוב.")
      return
    }

    setLoading(true)
    setShowRepairShops(true)

    // חיפוש מוסכים בהתבסס על מיקום המשתמש
    setTimeout(() => {
      // חישוב מרחקים מהמיקום הנוכחי
      const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371 // רדיוס כדור הארץ בק"מ
        const dLat = ((lat2 - lat1) * Math.PI) / 180
        const dLng = ((lng2 - lng1) * Math.PI) / 180
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
      }

      // מוסכים עם מיקומים אמיתיים (דוגמאות מאזור תל אביב)
      const mockRepairShopsWithLocations = [
        {
          name: "מוסך אלון - בדיקות טכניות מקצועיות",
          rating: 4.8,
          address: "רחוב הרצל 45, תל אביב",
          phone: "03-5551234",
          lat: 32.0668,
          lng: 34.7647,
          isOpen: true,
        },
        {
          name: "מרכז בדיקות BMW מורשה",
          rating: 4.6,
          address: "שדרות רוקח 15, תל אביב",
          phone: "03-5555678",
          lat: 32.0853,
          lng: 34.7818,
          isOpen: true,
        },
        {
          name: "מוסך דוד - בדיקות מהירות",
          rating: 4.4,
          address: "רחוב יהודה הלוי 23, תל אביב",
          phone: "03-5559876",
          lat: 32.0644,
          lng: 34.7736,
          isOpen: false,
        },
        {
          name: "אוטו סנטר - בדיקות מקיפות",
          rating: 4.7,
          address: "רחוב דיזנגוף 112, תל אביב",
          phone: "03-5554321",
          lat: 32.0804,
          lng: 34.7746,
          isOpen: true,
        },
        {
          name: "מוסך הכוכב - מומחים לבדיקות רכב",
          rating: 4.9,
          address: "רחוב אבן גבירול 78, תל אביב",
          phone: "03-5557890",
          lat: 32.0853,
          lng: 34.7818,
          isOpen: true,
        },
        {
          name: "מוסך רמת גן - שירות מהיר",
          rating: 4.5,
          address: "רחוב ביאליק 12, רמת גן",
          phone: "03-5552468",
          lat: 32.0719,
          lng: 34.8242,
          isOpen: true,
        },
        {
          name: "מוסך פתח תקווה - בדיקות מקצועיות",
          rating: 4.3,
          address: "רחוב הרב קוק 25, פתח תקווה",
          phone: "03-5553579",
          lat: 32.0922,
          lng: 34.8878,
          isOpen: true,
        },
      ]

      // חישוב מרחק לכל מוסך ומיון לפי מרחק
      const shopsWithDistance = mockRepairShopsWithLocations
        .map((shop) => ({
          ...shop,
          distance: calculateDistance(userLocation.lat, userLocation.lng, shop.lat, shop.lng).toFixed(1) + ' ק"מ',
        }))
        .sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))

      // לקיחת 5 המוסכים הקרובים ביותר
      const nearestShops = shopsWithDistance.slice(0, 5).map((shop) => ({
        name: shop.name,
        rating: shop.rating,
        address: shop.address,
        phone: shop.phone,
        distance: shop.distance,
        isOpen: shop.isOpen,
      }))

      setRepairShops(nearestShops)
      setLoading(false)
    }, 2000)
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

        {/* הוסף אחרי הכותרת הראשית */}
        {locationError && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm text-center mb-6">
            {locationError}
          </div>
        )}

        {userLocation && !locationError && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm text-center mb-6">
            ✅ מיקום זוהה בהצלחה - נמצא מוסכים קרובים אליך
          </div>
        )}

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

        {/* Repair Shops Results */}
        {showRepairShops && (
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <Wrench className="h-6 w-6 mr-3" />
                מוסכים מומלצים לבדיקה ראשונית
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">מחפש מוסכים מתאימים לבדיקות שבחרת...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-600 mb-6">
                    מצאנו {repairShops.length} מוסכים מומלצים באזורך שמתמחים בבדיקות שבחרת:
                  </p>

                  {repairShops.map((shop, index) => (
                    <Card
                      key={index}
                      className="border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                            <div className="flex items-center mb-2">
                              <div className="flex items-center mr-4">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(shop.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-gray-600 font-medium">{shop.rating}</span>
                              </div>
                              <Badge
                                variant={shop.isOpen ? "default" : "secondary"}
                                className={shop.isOpen ? "bg-green-600" : "bg-gray-500"}
                              >
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
                          <Button
                            onClick={() => openInGoogleMaps(shop.address)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            נווט במפות גוגל
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Phone className="h-4 w-4 mr-2" />
                            התקשר
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="text-center mt-8">
                    <p className="text-gray-600 mb-4">מצאת את מה שחיפשת?</p>
                    <Button
                      onClick={() => router.push("/buyer")}
                      variant="outline"
                      className="border-2 border-green-300 hover:bg-green-50"
                    >
                      חזור לחיפוש רכבים נוספים
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}



