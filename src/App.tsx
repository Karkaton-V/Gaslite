import AppRoutes from "@/app/routes/AppRoutes";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <div className="min-h screen bg-background p-8 text-foreground">

      
      
      <Card className="w-[300px] bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Test field" />
          <Button>Test Button</Button>
        </CardContent>
      </Card>
    </div>
  )
}