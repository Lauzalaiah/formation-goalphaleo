"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError("Email ou mot de passe incorrect.")
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("has_access")
      .eq("id", data.user.id)
      .single()

    if (!profile?.has_access) {
      setError("Vous n'avez pas accès à la formation.")
      setLoading(false)
      return
    }

    router.push("/formation")
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-2xl w-[400px] space-y-4 border border-zinc-800"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          Connexion
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-500 p-3 rounded text-white font-bold"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  )
}
