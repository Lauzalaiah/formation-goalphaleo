"use client"

import { login } from "@/app/auth/actions"
import { Lock, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-8"
      style={{ backgroundImage: "url('/images/dollar-bg-bright.jpg')" }}
    >
      <div className="absolute inset-0 z-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-8">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Connexion
          </h1>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            Accédez à votre formation Fansly Agency Mastery
          </p>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block font-sans text-sm font-medium text-foreground"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="votre@email.com"
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block font-sans text-sm font-medium text-foreground"
            >
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-4 py-2 font-sans text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full cursor-pointer rounded-lg bg-primary px-6 py-4 font-sans text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                Connexion en cours...
              </span>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-sans text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
