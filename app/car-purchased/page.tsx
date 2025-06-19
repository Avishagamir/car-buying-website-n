"use client"

import { useEffect, useRef, useState } from "react"
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
  const [searchLocation, setSearchLocation] = useState("תל אביב")
  const inputRef = useRef<HTMLInputElement>(null)

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
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error("API key is undefined")
      return
    }
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      if (window.google && inputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "il" },
          types: ["(cities)"],
        })
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace()
          if (place?.formatted_address) {
            setSearchLocation(place.formatted_address)
          } else if (place?.name) {
            setSearchLocation(place.name)
          }
        })
      }
    }
  }, [])

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

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: searchLocation }, (results: any, status: string) => {
      if (status === "OK" && results?.length > 0) {
        const location = results[0].geometry.location
        const map = new window.google.maps.Map(document.createElement("div")) // צורך חובה
        const service = new window.google.maps.places.PlacesService(map)

        service.nearbySearch(
          {
            location,
            radius: 15000,
            keyword: "מוסך",
          },
          (results: any[], status: string) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
              const shops = results.slice(0, 10).map((place) => ({
                name: place.name || "לא ידוע",
                rating: place.rating || 0,
                address: place.vicinity || "",
                phone: place.formatted_phone_number || "אין מידע",
                distance: calculateDistance(location, place.geometry?.location) + ' ק"מ',
                isOpen: place.opening_hours?.isOpen() ?? false,
                location: place.geometry?.location,
              }))
              setRepairShops(shops)
            } else {
              alert("לא נמצאו מוסכים באזור זה.")
              setRepairShops([])
            }
            setLoading(false)
          }
        )
      } else {
        alert("לא הצלחנו למצוא את המיקום שהוזן. אנא נסה שוב.")
        setLoading(false)
      }
    })
  }

  function calculateDistance(loc1: google.maps.LatLng, loc2?: google.maps.LatLng) {
    if (!loc2) return "לא ידוע"
    const R = 6371
    const dLat = deg2rad(loc2.lat() - loc1.lat())
    const dLon = deg2rad(loc2.lng() - loc1.lng())
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(loc1.lat())) * Math.cos(deg2rad(loc2.lat())) * Math.sin(dLon / 2) ** 2
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
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">בחר בדיקות לרכב וחפש מוסך</h2>

      <div className="mb-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="הכנס עיר או כתובת"
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-6">
        {carChecks.map((check) => (
          <div key={check} className="flex items-center mb-2">
            <Checkbox checked={selectedChecks.includes(check)} onChange={() => handleCheckToggle(check)} />
            <label className="ml-2">{check}</label>
          </div>
        ))}
      </div>

      <Button onClick={findRepairShops} disabled={loading || selectedChecks.length === 0}>
        {loading ? "מחפש..." : "מצא מוסכים מתאימים"}
      </Button>

      {showRepairShops && (
        <div className="mt-8 space-y-4">
          {repairShops.map((shop, idx) => (
            <Card key={idx} className="p-4 border">
              <h3 className="text-xl font-bold">{shop.name}</h3>
              <p>{shop.address}</p>
              <p>דירוג: {shop.rating}</p>
              <p>מרחק: {shop.distance}</p>
              <p>{shop.isOpen ? "פתוח עכשיו" : "סגור"}</p>
              <Button onClick={() => openInGoogleMaps(shop.address)} className="mt-2">
                נווט בגוגל מפות
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
