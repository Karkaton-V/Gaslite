import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <Card style={{ width: "300px" }}>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input placeholder="Test field" />
          <Button>Test Button</Button>
        </CardContent>
      </Card>
    </div>
  )
}