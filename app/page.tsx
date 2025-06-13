"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, MessageCircle, Shield, Star, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [currentCar, setCurrentCar] = useState(0)

  const featuredCars = [
    {
      id: 1,
      make: "BMW",
      model: "X1 Series",
      year: 2023,
      price: 45000,
      mileage: 15000,
      horsepower: 240,
      transmission: "Automatic",
      image: "https://www.topgear.com/sites/default/files/2022/11/P90485000_highRes_bmw-330e-xdrive-tour.jpg",
      rating: 4.8,
    },
    {
      id: 2,
      make: "Chevrolet",
      model: "Camaro ZL1",
      year: 2024,
      price: 68000,
      mileage: 5000,
      horsepower: 650,
      transmission: "Manual",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaQaiEBtcZ8K8segtqMapePrKfVjdAspcDPg&s",
      rating: 4.9,
    },
    {
      id: 3,
      make: "Lamborghini",
      model: "Huracán",
      year: 2023,
      price: 220000,
      mileage: 3100,
      horsepower: 630,
      transmission: "Automatic",
      image: "https://www.topgear.com/sites/default/files/2022/11/P90485000_highRes_bmw-330e-xdrive-tour.jpg",
      rating: 5.0,
    },
    {
      id: 4,
      make: "Audi",
      model: "A3 Sedan",
      year: 2024,
      price: 35500,
      mileage: 8500,
      horsepower: 240,
      transmission: "Automatic",
      image: "https://www.topgear.com/sites/default/files/2022/11/P90485000_highRes_bmw-330e-xdrive-tour.jpg",
      rating: 4.7,
    },
  ]

  const newestCars = [
    {
      make: "BMW",
      model: "Series-3 Wagon",
      description:
        "Experience luxury and performance with this stunning BMW Series-3 Wagon. Featuring premium leather interior, advanced safety systems, and exceptional fuel efficiency.",
      additionalInfo:
        "This vehicle comes with a comprehensive warranty and has been meticulously maintained by certified BMW technicians.",
      image: "https://www.topgear.com/sites/default/files/2022/11/P90485000_highRes_bmw-330e-xdrive-tour.jpg",
      price: "$52,900",
      year: "2024",
    },
    {
      make: "Mercedes",
      model: "C-Class Estate",
      description:
        "Discover the perfect blend of elegance and functionality with the Mercedes C-Class Estate. Spacious interior meets cutting-edge technology.",
      additionalInfo: "Equipped with the latest MBUX infotainment system and advanced driver assistance features.",
      image: "https://www.topgear.com/sites/default/files/2021/06/BEH_0302.jpg",
      price: "$48,500",
      year: "2024",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Los Angeles, CA",
      text: "CARMATCH made finding my dream car effortless! The AI assistant understood exactly what I needed and found the perfect match within my budget.",
      avatar: "https://www.prog.co.il/attachments/%D7%94%D7%AA%D7%97%D7%9C%D7%94-gif.516108/",
      rating: 5,
      carBought: "2023 Tesla Model 3",
    },
    {
      name: "Michael Chen",
      location: "New York, NY",
      text: "As a seller, the platform helped me create a professional listing in minutes. Sold my car within a week at the price I wanted!",
      avatar: "https://images.maariv.co.il/image/upload/f_auto,fl_lossy/c_fill,g_faces:center,h_270,w_500/940967",
      rating: 5,
      carSold: "2022 BMW X5",
    },
    {
      name: "Emily Rodriguez",
      location: "Miami, FL",
      text: "The chatbot was incredibly helpful in guiding me through my first car purchase. Highly recommend CARMATCH to anyone!",
      avatar: "https://images.maariv.co.il/image/upload/f_auto,fl_lossy/c_fill,g_faces:center,h_700,w_950/877645",
      rating: 5,
      carBought: "2023 Honda Civic",
    },
  ]

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "25K+", label: "Cars Sold" },
    { number: "4.9", label: "Average Rating" },
    { number: "24/7", label: "AI Support" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CARMATCH
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-white hover:text-blue-400 transition-colors font-medium">
                HOME
              </a>
              <a href="#service" className="text-gray-300 hover:text-white transition-colors font-medium">
                SERVICES
              </a>
              <a href="#featured" className="text-gray-300 hover:text-white transition-colors font-medium">
                FEATURED CARS
              </a>
              <a href="#new" className="text-blue-400 font-semibold">
                NEW CARS
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors font-medium">
                REVIEWS
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors font-medium">
                CONTACT
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(59,130,246,0.3)), url('https://i.abcnewsfe.com/a/f43853f3-9eaf-4048-9ae7-757332c5787e/mclaren-1-ht-gmh-240412_1712928561648_hpMain_16x9.jpg?w=1600')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        <div className="relative text-center max-w-6xl px-4 z-10">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-4">
              🚗 AI-Powered Car Marketplace
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-wide leading-tight">
            GET YOUR DESIRED CAR IN{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              REASONABLE PRICE
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 leading-relaxed text-gray-200 max-w-4xl mx-auto">
            Welcome to Car Match — your smart car search companion! Using advanced AI, we match you with the perfect
            vehicle based on your budget, preferences, and lifestyle. Let us do the thinking, so you can drive away with
            confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                כניסה
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-black hover:bg-white hover:text-black px-12 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              >
                הרשמה
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newest Cars Section */}
      <section id="new" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              Latest Collection
            </span>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Newest Cars</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <img
                src={newestCars[currentCar].image || "/placeholder.svg"}
                alt={`${newestCars[currentCar].make} ${newestCars[currentCar].model}`}
                className="relative w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {newestCars[currentCar].year}
              </div>
              <div className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                {newestCars[currentCar].price}
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {newestCars[currentCar].make} <span className="text-blue-600">{newestCars[currentCar].model}</span>
                </h4>
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-gray-600 font-medium">5.0 (124 reviews)</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">{newestCars[currentCar].description}</p>
              <p className="text-gray-600 leading-relaxed">{newestCars[currentCar].additionalInfo}</p>
              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all">
                  View Details
                </Button>
                <Button variant="outline" className="px-8 py-3 font-semibold border-2 hover:bg-gray-50">
                  Schedule Test Drive
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12 space-x-3">
            {newestCars.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCar(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentCar
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section
        id="featured"
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.9), rgba(59,130,246,0.3)), url('/images/featured-cars-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-4">
              Premium Selection
            </span>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Featured Cars</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCars.map((car) => (
              <Card
                key={car.id}
                className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
              >
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <img
                      src={car.image || "/placeholder.svg"}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                      {car.year}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(car.rating) ? "text-yellow-400 fill-current" : "text-gray-400"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-300">{car.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-white/10 rounded-lg p-2 text-center">
                        <div className="text-blue-400 font-semibold">{car.mileage.toLocaleString()}</div>
                        <div className="text-gray-300 text-xs">Miles</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2 text-center">
                        <div className="text-blue-400 font-semibold">{car.horsepower}</div>
                        <div className="text-gray-300 text-xs">HP</div>
                      </div>
                    </div>
                    <h4 className="font-bold text-xl group-hover:text-blue-400 transition-colors">
                      {car.make} {car.model}
                    </h4>
                    <p className="text-3xl font-bold text-blue-400">${car.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Premium vehicle with exceptional performance and luxury features. Perfect for discerning drivers.
                    </p>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4">
              Customer Stories
            </span>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What Our Customers Say</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="text-center p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white"
              >
                <CardContent className="space-y-6">
                  <div className="relative">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-blue-100"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed italic">"{testimonial.text}"</p>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.location}</p>
                    <p className="text-blue-600 font-medium text-sm mt-1">
                      {testimonial.carBought ? `Bought: ${testimonial.carBought}` : `Sold: ${testimonial.carSold}`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Brand Logos */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h4 className="text-center text-gray-600 mb-8 font-medium">Trusted by leading automotive brands</h4>
            <div className="flex justify-center items-center space-x-12 opacity-60">
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">BMW</div>
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">AUDI</div>
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">MERCEDES</div>
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">HONDA</div>
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">TOYOTA</div>
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">HYUNDAI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Why Choose CARMATCH?</h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced technology meets simple car buying and selling
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4">AI-Powered Assistance</h4>
              <p className="text-gray-300 leading-relaxed">
                Get personalized recommendations and guidance throughout your car buying journey with our advanced AI
                technology.
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4">Secure Platform</h4>
              <p className="text-gray-300 leading-relaxed">
                Your data and transactions are protected with enterprise-grade security and encryption protocols.
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-4">Direct Connections</h4>
              <p className="text-gray-300 leading-relaxed">
                Connect directly with buyers and sellers without intermediaries, ensuring the best deals for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CARMATCH
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Your smart car search companion. Using advanced AI to match you with the perfect vehicle based on your
                preferences and budget.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@carmatch.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 Auto Street, Car City</li>
                <li>🕒 24/7 Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CARMATCH. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
