"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api-client"
import { Loader2, Play, CheckCircle, AlertCircle } from "lucide-react"

export default function ApiDemo() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("")
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const endpoints = [
    {
      name: "Get All Chapters",
      method: "GET",
      endpoint: "/api/chapters",
      description: "Retrieve all chapters with optional filters",
      example: async () => apiClient.getChapters(),
    },
    {
      name: "Get Chapter by ID",
      method: "GET",
      endpoint: "/api/chapters/[id]",
      description: "Get a specific chapter by ID",
      example: async () => apiClient.getChapter("phys-1"),
    },
    {
      name: "Update Chapter Progress",
      method: "PUT",
      endpoint: "/api/chapters/[id]/progress",
      description: "Update chapter progress and stats",
      example: async () =>
        apiClient.updateChapterProgress("phys-1", {
          progress: 75,
          accuracy: 85,
          speed: 70,
          score: 8.5,
        }),
    },
    {
      name: "Get Dashboard Analytics",
      method: "GET",
      endpoint: "/api/analytics/dashboard",
      description: "Get comprehensive analytics for dashboard",
      example: async () => apiClient.getDashboardAnalytics(),
    },
    {
      name: "Get Subject Analytics",
      method: "GET",
      endpoint: "/api/analytics/subject/[subject]",
      description: "Get analytics for a specific subject",
      example: async () => apiClient.getSubjectAnalytics("physics"),
    },
    {
      name: "Search Chapters",
      method: "GET",
      endpoint: "/api/search",
      description: "Search chapters by name",
      example: async () => apiClient.searchChapters("motion"),
    },
    {
      name: "Get User Profile",
      method: "GET",
      endpoint: "/api/user/profile",
      description: "Get user profile information",
      example: async () => apiClient.getUserProfile(),
    },
    {
      name: "Get Statistics",
      method: "GET",
      endpoint: "/api/stats",
      description: "Get comprehensive statistics",
      example: async () => apiClient.getStats(),
    },
  ]

  const executeEndpoint = async (endpoint: any) => {
    setLoading(true)
    setSelectedEndpoint(endpoint.name)

    try {
      const result = await endpoint.example()
      setResponse(result)
    } catch (error) {
      setResponse({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">MathonGo API Demo</h1>
        <p className="text-muted-foreground">Test all the API endpoints for the MathonGo application</p>
      </div>

      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <div className="grid gap-4">
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{endpoint.method}</Badge>
                      <Button size="sm" onClick={() => executeEndpoint(endpoint)} disabled={loading}>
                        {loading && selectedEndpoint === endpoint.name ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {endpoint.method} {endpoint.endpoint}
                  </code>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                API Response
                {response && (
                  <Badge variant={response.success ? "default" : "destructive"}>
                    {response.success ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {response.success ? "Success" : "Error"}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <div className="text-sm font-mono bg-muted p-2 rounded mt-1">
                      {response.success ? "✅ Success" : "❌ Error"}
                    </div>
                  </div>

                  {response.message && (
                    <div>
                      <Label>Message</Label>
                      <div className="text-sm bg-muted p-2 rounded mt-1">{response.message}</div>
                    </div>
                  )}

                  {response.error && (
                    <div>
                      <Label>Error</Label>
                      <div className="text-sm bg-destructive/10 text-destructive p-2 rounded mt-1">
                        {response.error}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Response Data</Label>
                    <Textarea
                      value={JSON.stringify(response, null, 2)}
                      readOnly
                      className="mt-1 font-mono text-xs"
                      rows={20}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Select an endpoint to see the response</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
