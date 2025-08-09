"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, RefreshCw, Globe, Bell, Shield, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Site settings state
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Yammy Yami Diapers",
    siteDescription: "High-quality diapers and hygiene products at affordable prices",
    contactEmail: "info@yammyyami.com",
    contactPhone: "+255 658 181 863",
    whatsappNumber: "+255 658 181 863",
    address: "Kariakoo, Dar es Salaam, Tanzania",
    currency: "TZS",
    language: "en",
  })

  // Notification settings state
  const [notificationSettings, setSiteNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
    registrationAlerts: true,
    marketingEmails: false,
  })

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90",
    sessionTimeout: "30",
    ipRestriction: false,
  })

  // User settings state
  const [userSettings, setUserSettings] = useState({
    username: "admin",
    email: "admin@yammyyami.com",
    firstName: "Admin",
    lastName: "User",
    role: "administrator",
    phone: "+255 123 456 789",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSiteSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSiteSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationSettingsChange = (name: string, checked: boolean) => {
    setSiteNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityToggleChange = (name: string, checked: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleUserSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setUserSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save settings to localStorage for demo purposes
      localStorage.setItem("yammy-site-settings", JSON.stringify(siteSettings))
      localStorage.setItem("yammy-notification-settings", JSON.stringify(notificationSettings))
      localStorage.setItem("yammy-security-settings", JSON.stringify(securitySettings))
      localStorage.setItem("yammy-user-settings", JSON.stringify(userSettings))

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-yammy-dark-blue font-bubblegum">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and preferences.</p>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="site" className="w-full">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="site" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Site
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" /> User
            </TabsTrigger>
          </TabsList>

          {/* Site Settings */}
          <TabsContent value="site">
            <Card className="border-yammy-blue/20">
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Manage your store information and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      value={siteSettings.siteName}
                      onChange={handleSiteSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select
                      value={siteSettings.language}
                      onValueChange={(value) => setSiteSettings((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={siteSettings.siteDescription}
                    onChange={handleSiteSettingsChange}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={siteSettings.contactEmail}
                      onChange={handleSiteSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={siteSettings.contactPhone}
                      onChange={handleSiteSettingsChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={siteSettings.whatsappNumber}
                      onChange={handleSiteSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={siteSettings.currency}
                      onValueChange={(value) => setSiteSettings((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TZS">Tanzanian Shilling (TZS)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={siteSettings.address}
                    onChange={handleSiteSettingsChange}
                    rows={2}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-yammy-blue hover:bg-yammy-dark-blue"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="border-yammy-blue/20">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications and alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="orderNotifications">Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                  </div>
                  <Switch
                    id="orderNotifications"
                    checked={notificationSettings.orderNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange("orderNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="stockAlerts">Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when products are low in stock</p>
                  </div>
                  <Switch
                    id="stockAlerts"
                    checked={notificationSettings.stockAlerts}
                    onCheckedChange={(checked) => handleNotificationSettingsChange("stockAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="registrationAlerts">Registration Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new agent registrations</p>
                  </div>
                  <Switch
                    id="registrationAlerts"
                    checked={notificationSettings.registrationAlerts}
                    onCheckedChange={(checked) => handleNotificationSettingsChange("registrationAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationSettingsChange("marketingEmails", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-yammy-blue hover:bg-yammy-dark-blue"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="border-yammy-blue/20">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityToggleChange("twoFactorAuth", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Select
                    value={securitySettings.passwordExpiry}
                    onValueChange={(value) => setSecuritySettings((prev) => ({ ...prev, passwordExpiry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiry period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings((prev) => ({ ...prev, sessionTimeout: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeout period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ipRestriction">IP Restriction</Label>
                    <p className="text-sm text-muted-foreground">Restrict login to specific IP addresses</p>
                  </div>
                  <Switch
                    id="ipRestriction"
                    checked={securitySettings.ipRestriction}
                    onCheckedChange={(checked) => handleSecurityToggleChange("ipRestriction", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-yammy-blue hover:bg-yammy-dark-blue"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* User Settings */}
          <TabsContent value="user">
            <Card className="border-yammy-blue/20">
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
                <CardDescription>Update your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={userSettings.firstName}
                      onChange={handleUserSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={userSettings.lastName}
                      onChange={handleUserSettingsChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={userSettings.username}
                      onChange={handleUserSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={userSettings.role}
                      onValueChange={(value) => setUserSettings((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrator">Administrator</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userSettings.email}
                      onChange={handleUserSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={userSettings.phone} onChange={handleUserSettingsChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Change Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Enter new password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-yammy-blue hover:bg-yammy-dark-blue"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}
