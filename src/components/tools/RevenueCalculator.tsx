"use client"

import { useState, useEffect, useRef } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RevenueCalculator() {
  // Business model selection
  const [businessModel, setBusinessModel] = useState("subscription")

  // Shared state
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState(10)
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>([])

  // Marketplace model state
  const [gmv, setGmv] = useState(1000000)
  const [commissionRate, setCommissionRate] = useState(5)
  const [transactions, setTransactions] = useState(10000)
  const [avgTransactionValue, setAvgTransactionValue] = useState(100)

  // One-time purchase model state
  const [pricePerUnit, setPricePerUnit] = useState(100)
  const [unitsSold, setUnitsSold] = useState(1000)

  // Subscription model state
  const [monthlyPrice, setMonthlyPrice] = useState(29.99)
  const [initialSubscribers, setInitialSubscribers] = useState(100)
  const [churnRate, setChurnRate] = useState(5)

  // Revenue calculations
  const [revenue, setRevenue] = useState(0)

  // Canvas reference for chart
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Update GMV when transactions or avg value changes
  useEffect(() => {
    if (businessModel === "marketplace") {
      const calculatedGmv = transactions * avgTransactionValue
      setGmv(calculatedGmv)
    }
  }, [transactions, avgTransactionValue, businessModel])

  // Calculate revenue based on business model
  useEffect(() => {
    let calculatedRevenue = 0
    let monthlyData: number[] = []

    if (businessModel === "marketplace") {
      calculatedRevenue = gmv * (commissionRate / 100)

      // Generate monthly revenue projection with growth
      monthlyData = Array(12)
        .fill(0)
        .map((_, i) => {
          const baseMonthlyRevenue = calculatedRevenue / 12
          return baseMonthlyRevenue * Math.pow(1 + monthlyGrowthRate / 100, i)
        })
    } else if (businessModel === "oneTime") {
      calculatedRevenue = pricePerUnit * unitsSold

      // Distribute sales throughout the year with growth
      monthlyData = Array(12)
        .fill(0)
        .map((_, i) => {
          const baseMonthlyRevenue = calculatedRevenue / 12
          return baseMonthlyRevenue * Math.pow(1 + monthlyGrowthRate / 100, i)
        })
    } else if (businessModel === "subscription") {
      let subscribers = initialSubscribers
      monthlyData = []

      // Calculate monthly revenue for 12 months
      for (let i = 0; i < 12; i++) {
        // New subscribers from growth
        const newSubscribers = Math.floor(subscribers * (monthlyGrowthRate / 100))

        // Lost subscribers from churn
        const lostSubscribers = Math.floor(subscribers * (churnRate / 100))

        // Update total subscribers
        subscribers = subscribers + newSubscribers - lostSubscribers

        // Calculate revenue for this month
        const revenueThisMonth = subscribers * monthlyPrice
        calculatedRevenue += revenueThisMonth
        monthlyData.push(revenueThisMonth)
      }
    }

    setRevenue(calculatedRevenue)
    setMonthlyRevenue(monthlyData)
  }, [
    businessModel,
    gmv,
    commissionRate,
    pricePerUnit,
    unitsSold,
    monthlyPrice,
    initialSubscribers,
    churnRate,
    monthlyGrowthRate,
  ])

  // Draw chart
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Calculate max value for scaling
    const maxValue = Math.max(...monthlyRevenue) * 1.1 || 1000

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw data points and lines
    if (monthlyRevenue.length > 0) {
      const pointWidth = (width - padding * 2) / (monthlyRevenue.length - 1)

      // Draw line
      ctx.beginPath()
      ctx.strokeStyle = "#0ea5e9"
      ctx.lineWidth = 2

      // Move to first point
      ctx.moveTo(padding, height - padding - (monthlyRevenue[0] / maxValue) * (height - padding * 2))

      // Draw lines to each point
      for (let i = 1; i < monthlyRevenue.length; i++) {
        const x = padding + i * pointWidth
        const y = height - padding - (monthlyRevenue[i] / maxValue) * (height - padding * 2)
        ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Draw points
      for (let i = 0; i < monthlyRevenue.length; i++) {
        const x = padding + i * pointWidth
        const y = height - padding - (monthlyRevenue[i] / maxValue) * (height - padding * 2)

        ctx.beginPath()
        ctx.fillStyle = "#0ea5e9"
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw month labels
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      for (let i = 0; i < Math.min(monthlyRevenue.length, months.length); i++) {
        const x = padding + i * pointWidth
        ctx.fillText(months[i], x, height - padding + 15)
      }

      // Draw value labels (y-axis)
      ctx.textAlign = "right"
      ctx.fillText("$0", padding - 5, height - padding + 5)
      ctx.fillText(formatCurrency(maxValue), padding - 5, padding - 5)
    }
  }, [monthlyRevenue])

  // Render the appropriate input fields based on business model
  const renderInputFields = () => {
    // Common growth rate field for all models
    const growthRateField = (
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Monthly Growth Rate</Label>
          <span className="text-sm font-medium">{monthlyGrowthRate}%</span>
        </div>
        <Slider
          value={[monthlyGrowthRate]}
          min={0}
          max={50}
          step={1}
          onValueChange={(value) => setMonthlyGrowthRate(value[0])}
        />
      </div>
    )

    if (businessModel === "marketplace") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>GMV (Gross Merchandise Value)</Label>
              <span className="text-sm font-medium">{formatCurrency(gmv)}</span>
            </div>
            <Slider
              value={[gmv]}
              min={100000}
              max={10000000}
              step={100000}
              onValueChange={(value) => setGmv(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Commission Rate</Label>
              <span className="text-sm font-medium">{commissionRate}%</span>
            </div>
            <Slider
              value={[commissionRate]}
              min={1}
              max={30}
              step={0.5}
              onValueChange={(value) => setCommissionRate(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Number of Transactions</Label>
              <span className="text-sm font-medium">{transactions.toLocaleString()}</span>
            </div>
            <Slider
              value={[transactions]}
              min={1000}
              max={100000}
              step={1000}
              onValueChange={(value) => setTransactions(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Average Transaction Value</Label>
              <span className="text-sm font-medium">{formatCurrency(avgTransactionValue)}</span>
            </div>
            <Slider
              value={[avgTransactionValue]}
              min={10}
              max={1000}
              step={10}
              onValueChange={(value) => setAvgTransactionValue(value[0])}
            />
          </div>

          {growthRateField}
        </div>
      )
    } else if (businessModel === "oneTime") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Price Per Unit</Label>
              <span className="text-sm font-medium">{formatCurrency(pricePerUnit)}</span>
            </div>
            <Slider
              value={[pricePerUnit]}
              min={10}
              max={1000}
              step={10}
              onValueChange={(value) => setPricePerUnit(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Number of Units Sold</Label>
              <span className="text-sm font-medium">{unitsSold.toLocaleString()}</span>
            </div>
            <Slider
              value={[unitsSold]}
              min={100}
              max={10000}
              step={100}
              onValueChange={(value) => setUnitsSold(value[0])}
            />
          </div>

          {growthRateField}
        </div>
      )
    } else if (businessModel === "subscription") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Monthly Subscription Price</Label>
              <span className="text-sm font-medium">{formatCurrency(monthlyPrice)}</span>
            </div>
            <Slider
              value={[monthlyPrice]}
              min={4.99}
              max={199.99}
              step={5}
              onValueChange={(value) => setMonthlyPrice(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Initial Subscribers</Label>
              <span className="text-sm font-medium">{initialSubscribers}</span>
            </div>
            <Slider
              value={[initialSubscribers]}
              min={10}
              max={1000}
              step={10}
              onValueChange={(value) => setInitialSubscribers(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Monthly Churn Rate</Label>
              <span className="text-sm font-medium">{churnRate}%</span>
            </div>
            <Slider
              value={[churnRate]}
              min={0.5}
              max={30}
              step={0.5}
              onValueChange={(value) => setChurnRate(value[0])}
            />
          </div>

          {growthRateField}
        </div>
      )
    }

    return null
  }

  // Format currency helper function
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Get revenue title based on business model
  const getRevenueTitle = () => {
    switch (businessModel) {
      case "marketplace":
        return "Annual Commission Revenue"
      case "oneTime":
        return "Annual Revenue"
      case "subscription":
        return "First Year Revenue"
      default:
        return "Revenue"
    }
  }

  // Get revenue description based on business model
  const getRevenueDescription = () => {
    switch (businessModel) {
      case "marketplace":
        return `Based on ${commissionRate}% commission on ${formatCurrency(gmv)} GMV`
      case "oneTime":
        return `From ${unitsSold.toLocaleString()} units at ${formatCurrency(pricePerUnit)} each`
      case "subscription":
        return `Starting with ${initialSubscribers} subscribers at ${formatCurrency(monthlyPrice)}/month`
      default:
        return ""
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Revenue Calculator</CardTitle>
            <CardDescription>Estimate potential revenue based on different business models</CardDescription>
          </div>
          <Select value={businessModel} onValueChange={setBusinessModel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select business model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="marketplace">Marketplace Commission</SelectItem>
              <SelectItem value="oneTime">One-Time Purchase</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 py-4">
          <div className="grid gap-6 md:grid-cols-2">
            {renderInputFields()}

            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">{getRevenueTitle()}</h3>
                    <p className="text-3xl font-bold mt-2">{formatCurrency(revenue)}</p>
                    <p className="text-sm text-muted-foreground mt-1">{getRevenueDescription()}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="h-[200px]">
                <canvas ref={canvasRef} width={500} height={200} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 