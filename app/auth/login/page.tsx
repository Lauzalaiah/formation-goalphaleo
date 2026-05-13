"use client"

import { useState, useMemo } from "react"
import { createClient } from "@supabase/supabase-js"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const supabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const supabase = useMemo(() => {
    if (!supabaseConfigured) return null

    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }, [supabaseConfigured])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    console.log("LOGIN CLICKED")

    if (!supabase) {
      setError("Supabase n'est pas configuré.")
      return
    }

    try {
      setLoading(true)
      setError("")

      console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log("SUPABASE KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("SUPABASE RESPONSE", data, error)

      if (error) {
        console.log("LOGIN ERROR", error)

        setError(error.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError("Utilisateur introuvable.")
        setLoading(false)
        return
      }

      console.log("USER CONNECTED", data.user)

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("has_access, role")
        .eq("id", data.user.id)
        .single()

      console.log("PROFILE RESPONSE", profile, profileError)

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      if (
        !profile ||
        (
          !profile.has_access &&
          profile.role !== "admin"
        )
      ) {
        setError("Vous n'avez pas accès à la formation.")
        setLoading(false)
        return
      }

      console.log("REDIRECT TO FORMATION")

      window.location.href = "/formation"

    } catch (err) {
      console.log("GLOBAL ERROR", err)

      setError("Erreur inattendue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/dollar-bg-bright.jpg')",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-2xl w-[400px] space-y-4 border border-zinc-800"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          Connexion
        </h1>

        {!supabaseConfigured && (
          <div className="text-yellow-500 text-sm text-center p-3 bg-yellow-500/10 rounded">
            Supabase n&apos;est pas configuré.
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 text-white"
          disabled={!supabaseConfigured}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 text-white"
          disabled={!supabaseConfigured}
        />

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !supabaseConfigured}
          className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded text-white font-bold"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  )
}
