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

// Load Google Maps script dynamically
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.google) {
      resolve()
      return
    }

    const existingScript = document.getElementById("google-maps-script")
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve())
      return
    }

    const script = document.createElement("script")
    script.id = "google-maps-script"
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Google Maps script"))
    document.head.appendChild(script)
  })
}

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
  const [googleReady, setGoogleReady] = useState(false)

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

    loadGoogleMapsScript(apiKey)
      .then(() => setGoogleReady(true))
      .catch((err) => console.error("Google Maps load error:", err))
  }, [])

  const handleCheckToggle = (check: string) => {
    setSelectedChecks((prev) =>
      prev.includes(check) ? prev.filter((c) => c !== check) : [...prev, check]
    )
  }

  const findRepairShops = () => {
    if (!googleReady || !window.google) {
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
      {/* rest of your existing component remains unchanged */}
    </div>
  )
}
