"use client"

import { useState, useEffect, useRef } from "react"
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
  location?: google.maps.LatLng
}

export default function CarPurchasedPage() {
  const router = useRouter()
  const [selectedChecks, setSelectedChecks] = useState<string[]>([])
  const [showRepairShops, setShowRepairShops] = useState(false)
  const [repairShops, setRepairShops] = useState<RepairShop[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLocation, setSearchLocation] = useState<string>("תל אביב") // ברירת מחדל
  const autocompleteRef = useRef<HTMLInputElement>(null)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)

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
    if (!window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        if (autocompleteRef.current) {
          setAutocomplete(new window.google.maps.places.Autocomplete(autocompleteRef.current, { types: ["(cities)"], componentRestrictions: { country: "il" } }))
        }
      }
    } else {
      if (autocompleteRef.current) {
        setAutocomplete(new window.google.maps.places.Autocomplete(autocompleteRef.current, { types: ["(cities)"], componentRestrictions: { country: "il" } }))
      }
    }
  }, [])

  useEffect(() => {
    if (!autocomplete) return

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place.formatted_address) {
        setSearchLocation(place.formatted_address)
      } else if (place.name) {
        setSearchLocation(place.name)
      }
    })

    return () => {
      if (listener) {
        listener.remove()
      }
    }
  }, [autocomplete])

  const handleCheckToggle = (check: string) => {
    setSelectedChecks((prev) => (prev.includes(check) ? prev.filter((c) => c !== check) : [...prev, check]))
  }

  const findRepairShops = () => {
    if (!window.google) {
      alert("Google Maps לא נטען עדיין. אנא נסה שוב.")
      return
    }

    setLoading(true)
    setShowRepairShops(true)

    // מחפש מוסכים באזור לפי searchLocation
    const service = new window.google.maps.places.PlacesService(document.createElement("div"))
    const request = {
      query: "מוסך",
      location: null as google.maps.LatLng | null,
      radius: 15000, // 15 ק"מ
    }

    // משתמש ב-Geocode כדי לקבל מיקום מהטקסט
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: searchLocation }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        request.location = results[0].geometry.location

        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            // ממירים את התוצאות למבנה RepairShop
            const shops = results.slice(0, 10).map((place) => ({
              name: place.name || "לא ידוע",
              rating: place.rating || 0,
              address: place.formatted_address || "",
              phone: place.formatted_phone_number || "אין מידע",
              distance: calculateDistance(request.location!, place.geometry?.location) + " ק\"מ",
              isOpen: place.opening_hours?.isOpen() ?? false,
              location: place.geometry?.location,
            }))
            setRepairShops(shops)
          } else {
            alert("לא נמצאו מוסכים באזור זה.")
            setRepairShops([])
          }
          setLoading(false)
        })
      } else {
        alert("לא הצלחנו למצוא את המיקום שהוזן. אנא נסה שוב.")
        setLoading(false)
      }
    })
  }

  // פונקציה לחישוב מרחק בק"מ בין שני נקודות גיאוגרפיות
  function calculateDistance(loc1: google.maps.LatLng, loc2?: google.maps.LatLng) {
    if (!loc2) return "לא ידוע"
    const R = 6371 // רדיוס כדור הארץ בק"מ
    const dLat = deg2rad(loc2.lat() - loc1.lat())
    const dLon = deg2rad(loc2.lng() - loc1.lng())
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(loc1.lat())) * Math.cos(deg2rad(loc2.lat())) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(1)
  }
  function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
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
                    selectedChecks.includes(check) ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
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

            {/* שדה חיפוש מיקום ידני */}
            <div className="mb-6 text-right">
              <label htmlFor="location-input" className="block mb-2 font-semibold text-gray-700">
                חפש מוסכים באזור אחר (עיר/כתובת):
              </label>
              <input
                id="location-input"
                ref={autocompleteRef}
                type="text"
                placeholder="הקלד עיר או כתובת"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                defaultValue={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                dir="rtl"
              />
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
              ) : repairShops.length === 0 ? (
                <p className="text-center text-gray-600">לא נמצאו מוסכים מתאימים באזור זה.</p>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-600 mb-6">
                    מצאנו {repairShops.length} מוסכים מומלצים באזור {searchLocation} שמתמחים בבדיקות שבחרת:
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
                                <span className="ml-2 text-gray-600 font-medium">{shop.rating.toFixed(1)}</span>
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
                            <MapPin className="h-4 w-4 ml-2" />
                            <span>{shop.address}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 ml-2" />
                            <span>{shop.phone}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            onClick={() => openInGoogleMaps(shop.address)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            <Navigation className="h-4 w-4 ml-2" />
                            נווט במפות גוגל
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Phone className="h-4 w-4 ml-2" />
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
