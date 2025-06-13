"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, MessageCircle, Database, Zap, Bell, BarChart3, Check, ArrowRight, Star, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

declare global {
  interface Window {
    paypal: any
  }
}

export default function ProSubscriptionPage() {
  const router = useRouter()
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  useEffect(() => {
    // טעינת PayPal SDK
    const script = document.createElement("script")
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AdgtcxXXj4VwkdYoD61a9fxY72mi7cptuz7Hl6cUzqF-30sl_klblFXxZ47GFl-mMbJ1XzXFYAVF0hb1&currency=USD"
    script.async = true
    script.onload = () => {
      setPaypalLoaded(true)
      initPayPalButtons()
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const initPayPalButtons = () => {
    if (window.paypal) {
      // כפתור PRO
      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "9.99", // $9.99 במקום 29.90₪
                  },
                  description: "CARMATCH PRO Monthly Subscription",
                },
              ],
            })
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert(`תשלום בוצע בהצלחה! שלום ${details.payer.name.given_name}`)
              // כאן אפשר להפנות לדף הצלחה או לעדכן את המנוי
              router.push("/buyer")
            })
          },
          onError: (err: any) => {
            console.error("PayPal Error:", err)
            alert("שגיאה בתשלום. אנא נסה שוב.")
          },
        })
        .render("#paypal-pro-button")

      // כפתור PREMIUM
      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "16.99", // $16.99 במקום 49.90₪
                  },
                  description: "CARMATCH PREMIUM Monthly Subscription",
                },
              ],
            })
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert(`תשלום בוצע בהצלחה! שלום ${details.payer.name.given_name}`)
              router.push("/buyer")
            })
          },
          onError: (err: any) => {
            console.error("PayPal Error:", err)
            alert("שגיאה בתשלום. אנא נסה שוב.")
          },
        })
        .render("#paypal-premium-button")
    }
  }

  const features = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "שיחות ללא הגבלה",
      description: "דבר עם הבוט כמה שאתה רוצה, בלי מגבלות",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "מאגר רכבים מלא",
      description: "גישה לאלפי רכבים ממגוון יצרנים ודגמים",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "המלצות מתקדמות",
      description: "אלגוריתם חכם שמתאים רכבים בדיוק לצרכים שלך",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "השוואת רכבים",
      description: "השווה בין רכבים שונים בטבלה מפורטת",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "התראות חכמות",
      description: "קבל התראות על רכבים חדשים שמתאימים לך",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "תמיכה מועדפת",
      description: "תמיכה טכנית מהירה ומועדפת",
    },
  ]

  const plans = [
    {
      name: "חינמי",
      price: "0₪",
      priceUSD: "$0",
      period: "לחודש",
      features: ["2 המלצות רכב בלבד", "גישה מוגבלת לרכבים", "המלצות בסיסיות"],
      current: true,
    },
    {
      name: "PRO",
      price: "29.90₪",
      priceUSD: "$9.99",
      period: "לחודש",
      features: [
        "המלצות רכבים ללא הגבלה",
        "מאגר רכבים מלא",
        "המלצות מתקדמות",
        "השוואת רכבים",
        "התראות חכמות",
        "תמיכה מועדפת",
      ],
      popular: true,
      paypalId: "paypal-pro-button",
    },
    {
      name: "PREMIUM",
      price: "49.90₪",
      priceUSD: "$16.99",
      period: "לחודש",
      features: ["כל התכונות של PRO", "ייעוץ אישי עם מומחה", "דוחות מפורטים", "גישה מוקדמת לתכונות חדשות"],
      paypalId: "paypal-premium-button",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CARMATCH PRO
                </h1>
                <p className="text-sm text-gray-600">שדרג את חוויית חיפוש הרכב שלך</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/buyer")}
              className="border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              חזור לצ'אט
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <Crown className="h-4 w-4 mr-2" />
            שדרוג למנוי PRO
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              מצא את הרכב המושלם
            </span>
            <br />
            <span className="text-gray-900">בלי מגבלות</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            שדרג למנוי PRO וקבל גישה מלאה לכל התכונות המתקדמות שלנו. חיפוש חכם יותר, המלצות מדויקות יותר, ותוצאות טובות
            יותר.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">בחר את התוכנית המתאימה לך</h3>
            <p className="text-gray-600">כל התוכניות כוללות גישה מלאה לפלטפורמה</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50"
                    : plan.current
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-200 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                      הכי פופולרי
                    </Badge>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="secondary" className="bg-gray-600 text-white px-4 py-1">
                      התוכנית הנוכחית
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 mr-2">{plan.period}</span>
                    {plan.priceUSD && <div className="text-sm text-gray-500">({plan.priceUSD} USD)</div>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}

                  <div className="pt-6">
                    {plan.current ? (
                      <Button
                        className="w-full h-12 font-semibold rounded-xl bg-gray-400 text-gray-600 cursor-not-allowed"
                        disabled
                      >
                        התוכנית הנוכחית
                      </Button>
                    ) : plan.paypalId ? (
                      <div>
                        <div id={plan.paypalId} className="w-full"></div>
                        {!paypalLoaded && (
                          <div className="w-full h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                            <span className="text-gray-600">טוען PayPal...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button className="w-full h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white">
                        שדרג ל-{plan.name}
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* PayPal Info */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-16 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">תשלום מאובטח עם PayPal</h3>
          <p className="text-gray-600">התשלום מעובד באמצעות PayPal - פלטפורמת התשלומים המובילה והמאובטחת בעולם</p>
        </div>

        {/* Social Proof */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">מה אומרים המשתמשים שלנו</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "המנוי PRO חסך לי שעות של חיפושים. מצאתי את הרכב המושלם תוך דקות!"
              </p>
              <p className="font-semibold text-gray-900">- דני כהן, תל אביב</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">"ההמלצות מדויקות בדיוק לצרכים שלי. שירות מעולה!"</p>
              <p className="font-semibold text-gray-900">- רחל לוי, חיפה</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">"הכי טוב שיש! חיפוש חכם ומהיר עם תוצאות מעולות."</p>
              <p className="font-semibold text-gray-900">- מיכאל רוזן, ירושלים</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
            <div className="text-gray-600">משתמשים מרוצים</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
            <div className="text-gray-600">רכבים במאגר</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600">שביעות רצון</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">תמיכה זמינה</div>
          </div>
        </div>
      </div>
    </div>
  )
}
