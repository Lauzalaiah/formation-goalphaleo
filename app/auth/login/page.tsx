"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function LoginPage() {
  const router = useRouter()

  const supabase = createClientComponentClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    try {
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

      const user = data.user

      if (!user) {
        setError("Utilisateur introuvable.")
        setLoading(false)
        return
      }

      console.log("Utilisateur connecté :", user.id)

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("has_access, role")
        .eq("id", user.id)
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
        setError("Vous n'avez pas accès à la formation.")
        setLoading(false)
        return
      }

      await supabase.auth.refreshSession()

      router.push("/formation")
      router.refresh()

    } catch (err) {
      console.error(err)
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
