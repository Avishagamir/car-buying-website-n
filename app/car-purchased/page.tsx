"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Star,
  Wrench,
  Clock,
  Navigation,
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
  const autocompleteRef = useRef<HTMLInputElement | null>(null)

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
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!apiKey) {
      console.error("Google Maps API key is missing")
      return
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.onload = () => initAutocomplete()
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const initAutocomplete = () => {
    if (!autocompleteRef.current) return
    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      { types: ["(cities)"], componentRestrictions: { country: "il" } }
    )

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        getNearbyRepairShops(location)
        setShowRepairShops(true)
      }
    })
  }

  const getNearbyRepairShops = (location: google.maps.LatLngLiteral) => {
    const map = new window.google.maps.Map(document.createElement("div"))
    const service = new window.google.maps.places.PlacesService(map)

    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius: 10000,
      keyword: "מוסך",
      type: "car_repair",
    }

    service.nearbySearch(request, (results: any[], status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const mappedResults: RepairShop[] = results.map((place) => ({
          name: place.name || "לא ידוע",
          rating: place.rating || 0,
          address: place.vicinity || "",
          phone: "",
          distance: "",
          isOpen: place.opening_hours?.isOpen() ?? false,
        }))
        setRepairShops(mappedResults)
        setLoading(false)
      } else {
        alert("לא נמצאו מוסכים באזור.")
        setLoading(false)
      }
    })
  }

  const findRepairShops = () => {
    if (!window.google) {
      alert("Google Maps לא נטען. נסה שוב בעוד רגע.")
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        getNearbyRepairShops({ lat: latitude, lng: longitude })
        setShowRepairShops(true)
      },
      (error) => {
        alert("לא ניתן לקבל מיקום. השתמש בתיבת חיפוש עיר במקום.")
        setLoading(false)
      }
    )
  }

  const openInGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-green-100 sticky top-0 z-50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-700">ברכות על הרכישה!</h1>
            <p className="text-sm text-gray-600">בחר בדיקות והצג מוסכים קרובים</p>
          </div>
        </div>
        <Button onClick={() => router.push("/buyer")}>חזור לצ'אט</Button>
      </header>

      <div className="max-w-2xl mx-auto mt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-2">בחר בדיקות שתרצה לבצע:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {carChecks.map((check) => (
            <label key={check} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedChecks.includes(check)}
                onChange={() =>
                  setSelectedChecks((prev) =>
                    prev.includes(check)
                      ? prev.filter((c) => c !== check)
                      : [...prev, check]
                  )
                }
              />
              <span>{check}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <input
            ref={autocompleteRef}
            placeholder="או כתוב עיר (למשל: חיפה)"
            className="w-full border rounded-lg p-2 shadow-sm"
          />
          <Button onClick={findRepairShops} disabled={loading}>
            {loading ? "מחפש מוסכים..." : "מצא מוסכים באזור שלך"}
          </Button>
        </div>

        {showRepairShops && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">מוסכים שנמצאו:</h3>
            {repairShops.map((shop, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 mb-3 shadow-sm bg-white flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold text-green-700">{shop.name}</h4>
                  <p className="text-sm text-gray-600">{shop.address}</p>
                  <p className="text-sm">⭐ {shop.rating} | {shop.isOpen ? "פתוח" : "סגור"}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => openInGoogleMaps(shop.address)}
                >
                  <Navigation className="mr-1 h-4 w-4" /> ניווט
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
