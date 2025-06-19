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
  const [searchLocation, setSearchLocation] = useState<string>("תל אביב")
  const autocompleteContainerRef = useRef<HTMLDivElement>(null)
  const [placeAutocomplete, setPlaceAutocomplete] = useState<any>(null)

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
    if (window.google?.maps?.places?.PlaceAutocompleteElement) {
      setupPlaceAutocomplete()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      setupPlaceAutocomplete()
    }
  }, [])

  function setupPlaceAutocomplete() {
    if (!autocompleteContainerRef.current) return

    const element = new window.google.maps.places.PlaceAutocompleteElement({
      componentRestrictions: { country: ["il"] },
      types: ["(cities)"],
    })

    element.mount(autocompleteContainerRef.current)

    element.addListener("gmp-placeselect", (event: any) => {
      const place = event?.place
      if (place?.formattedAddress) {
        setSearchLocation(place.formattedAddress)
      } else if (place?.name) {
        setSearchLocation(place.name)
      }
    })

    setPlaceAutocomplete(element)
  }

  const handleCheckToggle = (check: string) => {
    setSelectedChecks((prev) =>
      prev.includes(check) ? prev.filter((c) => c !== check) : [...prev, check]
    )
  }

  const findRepairShops = () => {
    if (!window.google || !window.google.maps.places.PlacesService) {
      alert("Google Maps לא נטען עדיין. אנא נסה שוב.")
      return
    }

    setLoading(true)
    setShowRepairShops(true)

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: searchLocation }, (results: any, status: string) => {
      if (status === "OK" && results && results.length > 0) {
        const location = results[0].geometry.location

        const service = new window.google.maps.places.PlacesService(document.createElement("div"))
        const request = {
          location,
          radius: 15000,
          keyword: "מוסך",
        }

        service.nearbySearch(request, (results: any[], status: string) => {
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
        })
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
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(loc1.lat())) *
        Math.cos(deg2rad(loc2.lat())) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
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
    <div>
     
    </div>
  )
}
