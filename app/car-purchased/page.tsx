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
              phone: "",
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-10 px-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">בדיקה ראשונית לרכב</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {carChecks.map((check, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedChecks.includes(check)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleCheckToggle(check)}
              >
                <Checkbox
                  checked={selectedChecks.includes(check)}
                  onChange={() => handleCheckToggle(check)}
                />
                <label className="cursor-pointer flex-1 text-right" dir="rtl">
                  {check}
                </label>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={findRepairShops}
              disabled={selectedChecks.length === 0 || loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
            >
              {loading ? "מחפש מוסכים..." : "מצא מוסכים מתאימים"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showRepairShops && repairShops.length > 0 && (
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
          {repairShops.map((shop, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">{shop.name}</h3>
                <div className="text-sm text-gray-600 mb-1">{shop.address}</div>
                <div className="text-sm text-gray-600 mb-1">דירוג: {shop.rating}</div>
                <div className="text-sm text-gray-600 mb-1">{shop.isOpen ? "פתוח עכשיו" : "סגור כעת"}</div>
                <Button
                  onClick={() => openInGoogleMaps(shop.address)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                >
                  נווט בגוגל מפות
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
