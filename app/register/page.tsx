"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Car, Mail, Lock, User, Users, ShoppingCart, ArrowRight, Eye, EyeOff } from "lucide-react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("buyer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError("אנא מלא את כל השדות")
      return
    }

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים")
      return
    }

    setLoading(true)
    setError("")
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Save user role to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        createdAt: new Date(),
      })

      // Redirect based on role
      if (role === "buyer") {
        router.push("/buyer")
      } else {
        router.push("/seller")
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("האימייל כבר קיים במערכת")
      } else if (error.code === "auth/weak-password") {
        setError("הסיסמה חלשה מדי")
      } else {
        setError("שגיאה ביצירת החשבון")
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Car className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            הרשמה ל-CARMATCH
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">צור חשבון חדש והתחל למצוא את הרכב המושלם</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              שם מלא
            </Label>
            <div className="relative">
              <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="הכנס את שמך המלא"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pr-12 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all"
                dir="rtl"
              />
            </div>
          </div>

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
                className="pr-12 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all"
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
                placeholder="צור סיסמה (לפחות 6 תווים)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12 pl-12 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all"
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

          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">בחר את סוג החשבון</Label>
            <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-1 gap-4">
              <div
                className={`flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  role === "buyer" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem value="buyer" id="buyer" className="order-2" />
                <Label htmlFor="buyer" className="flex items-center cursor-pointer flex-1 order-1" dir="rtl">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">קונה</div>
                      <div className="text-sm text-gray-600">מחפש לקנות רכב</div>
                    </div>
                  </div>
                </Label>
              </div>
              <div
                className={`flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  role === "seller" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <RadioGroupItem value="seller" id="seller" className="order-2" />
                <Label htmlFor="seller" className="flex items-center cursor-pointer flex-1 order-1" dir="rtl">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">מוכר</div>
                      <div className="text-sm text-gray-600">רוצה למכור רכב</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <Button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                יוצר חשבון...
              </div>
            ) : (
              <div className="flex items-center">
                הרשמה
                <ArrowRight className="mr-2 h-5 w-5" />
              </div>
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">כבר יש לך חשבון? </span>
            <Button
              variant="link"
              onClick={() => router.push("/login")}
              className="p-0 h-auto text-purple-600 hover:text-purple-700 font-semibold"
            >
              התחבר כאן
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
