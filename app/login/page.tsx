"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("אנא מלא את כל השדות")
      return
    }

    setLoading(true)
    setError("")
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))
      const userData = userDoc.data()

      // Redirect based on role
      if (userData?.role === "buyer") {
        router.push("/buyer")
      } else if (userData?.role === "seller") {
        router.push("/seller")
      } else {
        // Default to buyer if no role found
        router.push("/buyer")
      }
    } catch (error: any) {
      setError("אימייל או סיסמה שגויים")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Car className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            כניסה ל-CARMATCH
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            התחבר לחשבון שלך והמשך למצוא את הרכב המושלם
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              אימייל
            </Label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="הכנס את האימייל שלך"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-12 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all"
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              סיסמה
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="הכנס את הסיסמה שלך"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12 pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all"
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <Button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                מתחבר...
              </div>
            ) : (
              <div className="flex items-center">
                כניסה
                <ArrowRight className="mr-2 h-5 w-5" />
              </div>
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">אין לך חשבון? </span>
            <Button
              variant="link"
              onClick={() => router.push("/register")}
              className="p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold"
            >
              הירשם כאן
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← חזור לדף הבית
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
