import { useEffect, useState } from "react"
import { supabase } from "@/shared/lib/supabase/client";

export default function Test() {
    const [data, setData] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect (() => {
        async function fetchData() {
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .limit(5)
            
            if (error) {
                setError(error.message)
            } else {
                setData(data)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) return <p>Loading</p>
    if (error) return <p>Error occured: {error}</p>

    return (
        <div style = {{ padding: '2rem' }}>
            <h1>DB TEST</h1>
            {data.length === 0 ? (
                <p>No data returned</p>
            ) : (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
        </div>
    )
}