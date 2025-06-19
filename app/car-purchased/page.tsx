"use client"

import { useEffect, useState } from "react"
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
  Search,
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
  const [city, setCity] = useState("")
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => {
      console.log("Google Maps API loaded")
    }
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleCheckToggle = (check: string) => {
    setSelectedChecks((prev) =>
      prev.includes(check) ? prev.filter((c) => c !== check) : [...prev, check]
    )
  }

  const findRepairShops = async () => {
    if (!window.google || !window.google.maps) {
      alert("Google Maps לא נטען עדיין. אנא נסה שוב.")
      return
    }

    setLoading(true)
    setShowRepairShops(true)

    const service = new window.google.maps.places.PlacesService(document.createElement("div"))

    const request = {
      query: city || "auto repair",
      fields: ["name", "geometry", "formatted_address", "formatted_phone_number", "rating", "business_status"],
      locationBias: city ? undefined : await getUserLocationBias(),
    }

    service.textSearch(request, (results: any[], status: string) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const parsed: RepairShop[] = results.slice(0, 5).map((r) => ({
          name: r.name,
          rating: r.rating || 0,
          address: r.formatted_address || "כתובת לא ידועה",
          phone: r.formatted_phone_number || "לא ידוע",
          distance: city ? "באזור העיר" : "לידך",
          isOpen: r.business_status === "OPERATIONAL",
        }))
        setRepairShops(parsed)
      } else {
        alert("לא נמצאו מוסכים. נסה עיר אחרת.")
      }
      setLoading(false)
    })
  }

  const getUserLocationBias = async (): Promise<any> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          resolve(new window.google.maps.LatLng(latitude, longitude))
        },
        () => {
          resolve(undefined)
        }
      )
    })
  }

  const openInGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* שאלון בדיקות */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>בדיקות רכב</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">בחר את הבדיקות שברצונך לבצע:</p>
          <div className="grid md:grid-cols-2 gap-3">
            {carChecks.map((check, i) => (
              <div
                key={i}
                onClick={() => handleCheckToggle(check)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedChecks.includes(check)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Checkbox
                  checked={selectedChecks.includes(check)}
                  onChange={() => handleCheckToggle(check)}
                  className="mr-2"
                />
                {check}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm mb-2">חפש לפי עיר (לא חובה):</label>
            <input
              type="text"
              placeholder="לדוג' תל אביב"
              className="border rounded-lg w-full p-2 text-right"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="text-center mt-6">
            <Button
              onClick={findRepairShops}
              disabled={selectedChecks.length === 0 || loading}
              className="px-6 py-3"
            >
              {loading ? "טוען..." : "מצא מוסכים מתאימים"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* תוצאות מוסכים */}
      {showRepairShops && !loading && repairShops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>מוסכים שנמצאו</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {repairShops.map((shop, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 shadow-sm hover:shadow transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{shop.name}</h3>
                    <p className="text-sm text-gray-600">{shop.address}</p>
                    <p className="text-sm text-gray-600">☎ {shop.phone}</p>
                  </div>
                  <div className="text-sm">
                    <p>⭐ {shop.rating}</p>
                    <p className={shop.isOpen ? "text-green-600" : "text-red-500"}>
                      {shop.isOpen ? "פתוח" : "סגור"}
                    </p>
                  </div>
                </div>
                <div className="text-left mt-3">
                  <Button onClick={() => openInGoogleMaps(shop.address)} className="text-sm">
                    <Navigation className="h-4 w-4 mr-2" />
                    נווט בגוגל מפות
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
