"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault()

  if (loading) return

  try {
    console.log("Début login")

    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("Réponse auth :", data, error)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (!data.user) {
      setError("Utilisateur introuvable.")
      setLoading(false)
      return
    }

    console.log("User connecté :", data.user.id)

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("has_access, role")
      .eq("id", data.user.id)
      .single()

    console.log("Profil :", profile)
    console.log("Erreur profil :", profileError)

    if (profileError) {
      setError("Erreur profil.")
      setLoading(false)
      return
    }

    if (
      !profile ||
      (!profile.has_access && profile.role !== "admin")
    ) {
      setError("Accès refusé.")
      setLoading(false)
      return
    }

    console.log("Redirection vers /formation")

    window.location.href = "/formation"
  } catch (err) {
    console.error("Erreur globale :", err)
    setError("Erreur inattendue.")
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
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 p-3 rounded text-white font-bold"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  )
}
