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
  LocateFixed,
} from "lucide-react"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

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
  const [manualAddress, setManualAddress] = useState("")
  const [useManualAddress, setUseManualAddress] = useState(false)

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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => console.log("Google Maps API loaded")
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
    if (!window.google && !useManualAddress) {
      alert("Google Maps לא נטען עדיין. אנא נסה שוב או הזן כתובת ידנית.")
      return
    }

    setLoading(true)
    setShowRepairShops(true)

    setTimeout(() => {
      const mockRepairShops: RepairShop[] = [
        {
          name: "מוסך אלון - בדיקות טכניות מקצועיות",
          rating: 4.8,
          address: "רחוב הרצל 45, תל אביב",
          phone: "03-5551234",
          distance: "1.2 ק\"מ",
          isOpen: true,
        },
        {
          name: "מרכז בדיקות BMW מורשה",
          rating: 4.6,
          address: "שדרות רוקח 15, תל אביב",
          phone: "03-5555678",
          distance: "2.1 ק\"מ",
          isOpen: true,
        },
      ]
      setRepairShops(mockRepairShops)
      setLoading(false)
    }, 1500)
  }

  const openInGoogleMaps = (address: string) => {
    const encoded = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ברכות על הרכישה!
              </h1>
              <p className="text-sm text-gray-600">בואו נכין אותך לבדיקה ראשונית של הרכב</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => router.push("/buyer")}>חזור לצ'אט</Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
            <CardTitle className="flex items-center text-2xl">
              <Sparkles className="h-6 w-6 ml-2" />
              בדיקות חשובות לרכב
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-6">
            <p className="text-gray-700 text-lg">
              סמן אילו בדיקות תרצה לבצע כדי שנמצא מוסך מתאים:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {carChecks.map((check, i) => (
                <div
                  key={i}
                  className={`flex items-center border-2 rounded-lg px-4 py-3 cursor-pointer transition-all ${
                    selectedChecks.includes(check)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleCheckToggle(check)}
                >
                  <Checkbox
                    checked={selectedChecks.includes(check)}
                    onChange={() => handleCheckToggle(check)}
                    className="ml-3"
                  />
                  <span>{check}</span>
                </div>
              ))}
            </div>
            {selectedChecks.length > 0 && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={useManualAddress} onCheckedChange={(val) => setUseManualAddress(!!val)} />
                  <span>הזנת כתובת ידנית במקום GPS</span>
                </div>
                {useManualAddress && (
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="לדוגמה: בן יהודה 1, תל אביב"
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                  />
                )}
              </div>
            )}
            <div className="text-center mt-6">
              <Button
                onClick={findRepairShops}
                disabled={selectedChecks.length === 0 || loading}
                className="px-6 py-3 text-lg"
              >
                {loading ? "מחפש מוסכים..." : "מצא מוסכים"}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                {selectedChecks.length} בדיקות נבחרו
              </p>
            </div>
          </CardContent>
        </Card>

        {showRepairShops && (
          <Card className="mt-10">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
              <CardTitle className="flex items-center text-2xl">
                <Wrench className="h-6 w-6 ml-2" />
                מוסכים מומלצים
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              {repairShops.map((shop, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{shop.name}</h3>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-gray-600">{shop.address}</span>
                    <Badge variant="outline">{shop.distance}</Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{shop.phone}</span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button onClick={() => openInGoogleMaps(shop.address)}>
                      <Navigation className="h-4 w-4 ml-1" /> ניווט
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
