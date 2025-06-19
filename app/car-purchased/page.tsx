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
    if (!window.google || !window.google.maps) {
      alert("Google Maps לא נטען עדיין. אנא נסה שוב.")
      return
    }

    setLoading(true)
    setShowRepairShops(true)

    if (!navigator.geolocation) {
      alert("המיקום שלך אינו זמין בדפדפן.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = new window.google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )

        const map = new window.google.maps.Map(document.createElement("div"))
        const service = new window.google.maps.places.PlacesService(map)

        const request = {
          location: userLocation,
          radius: 5000,
          type: "car_repair",
        }

        service.nearbySearch(request, (results: any[], status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const shops: RepairShop[] = results.slice(0, 5).map((place) => ({
              name: place.name,
              rating: place.rating || 0,
              address: place.vicinity,
              phone: "", // מידע זה לא תמיד זמין
              distance: "כ-5 ק\"מ",
              isOpen: place.opening_hours?.open_now ?? false,
            }))
            setRepairShops(shops)
          } else {
            alert("לא נמצאו מוסכים באזור שלך.")
          }
          setLoading(false)
        })
      },
      (error) => {
        alert("לא ניתן לגשת למיקום שלך.")
        console.error(error)
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
      {/* ...header, intro, etc... */}

      {/* Checklist */}
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

      {/* מוסכים */}
      {repairShops.map((shop, index) => (
        <Card key={index} className="border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(shop.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600 font-medium">{shop.rating}</span>
              <Badge className={shop.isOpen ? "bg-green-600 text-white ml-4" : "bg-gray-500 text-white ml-4"}>
                <Clock className="h-3 w-3 mr-1" />
                {shop.isOpen ? "פתוח עכשיו" : "סגור"}
              </Badge>
            </div>
            <div className="text-gray-600 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {shop.address}
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={() => openInGoogleMaps(shop.address)} className="flex-1 bg-blue-600 hover:bg-blue-700">
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
    </div>
  )
}
