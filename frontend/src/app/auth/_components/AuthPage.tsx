"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useAuth from '../hooks/useAuth'

export default function AuthPage() {
  const { login, register, isLoading, error, setError } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [first_name, setFirst_name] = useState('')
  const [date_of_birth, setDate_of_birth] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      login(email, password)
    } catch (error) {
      console.error(error)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response:any = await register(email, password, first_name, date_of_birth)
      if (response) {
        setRegisterSuccess(true)
        setActiveTab('login')
        clearFields()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const clearFields = () => {
    setEmail('')
    setPassword('')
    setFirst_name('')
    setDate_of_birth('')
    setError(null)
    setRegisterSuccess(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-center text-gray-500">
            Sign in to your account or create a new one
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {registerSuccess && (
            <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
              <AlertDescription>Registration successful! Please login with your credentials.</AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} className="w-full" onValueChange={(value) => {
            setActiveTab(value)
            clearFields()
          }}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Register
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    className="h-11 focus:ring-2 focus:ring-blue-600" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                    className="h-11 focus:ring-2 focus:ring-blue-600" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 transition-colors" 
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="Enter your email"
                    className="h-11 focus:ring-2 focus:ring-blue-600" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-medium">Password</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    placeholder="Create a password"
                    className="h-11 focus:ring-2 focus:ring-blue-600" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-sm font-medium">First Name</Label>
                  <Input 
                    id="firstname" 
                    type="text" 
                    placeholder="Enter your first name"
                    className="h-11 focus:ring-2 focus:ring-blue-600" 
                    required 
                    value={first_name} 
                    onChange={(e) => setFirst_name(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    type="date" 
                    className="h-11 focus:ring-2 focus:ring-blue-600" 
                    required 
                    value={date_of_birth} 
                    onChange={(e) => setDate_of_birth(e.target.value)} 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 transition-colors" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
