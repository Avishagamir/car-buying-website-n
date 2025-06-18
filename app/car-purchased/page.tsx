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

  const handleCheckToggle = (check: string) => {
    setSelectedChecks((prev) =>
      prev.includes(check) ? prev.filter((c) => c !== check) : [...prev, check]
    )
  }

  const getNearbyRepairShops = (location: google.maps.LatLngLiteral) => {
    const map = new window.google.maps.Map(document.createElement("div"))
    const service = new window.google.maps.places.PlacesService(map)

    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius: 5000,
      keyword: "מוסך",
      type: "car_repair",
    }

    service.nearbySearch(request, (results: any[], status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const mappedResults: RepairShop[] = results.map((place) => ({
          name: place.name || "לא ידוע",
          rating: place.rating || 0,
          address: place.vicinity || "",
          phone: "", // כדי לקבל צריך getDetails
          distance: "", // אפשר להוסיף חישוב בהמשך
          isOpen: place.opening_hours?.isOpen() ?? false,
        }))

        setRepairShops(mappedResults)
        setLoading(false)
      } else {
        alert("לא נמצאו מוסכים באזור שלך.")
        setLoading(false)
      }
    })
  }

  const findRepairShops = () => {
    if (!window.google) {
      alert("Google Maps לא נטען עדיין. אנא נסה שוב.")
      return
    }

    setLoading(true)
    setShowRepairShops(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        getNearbyRepairShops({ lat: latitude, lng: longitude })
      },
      (error) => {
        alert("לא ניתן לקבל מיקום. ודא שהרשית גישה למיקום.")
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
    </div>
  )
}
