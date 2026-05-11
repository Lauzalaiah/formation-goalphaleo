"use client"

import { signup } from "@/app/auth/actions"
import { Lock, Mail, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"

export default function SignupPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
      }
      if (result?.success) {
        setSuccess(result.success)
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
            Creer un compte
          </h1>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            Inscrivez-vous pour acceder a votre formation
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle className="size-16 text-green-500" />
            <p className="text-center font-sans text-foreground">{success}</p>
            <Link
              href="/auth/login"
              className="mt-4 rounded-lg bg-primary px-6 py-3 font-sans font-bold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Aller a la connexion
            </Link>
          </div>
        ) : (
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
                  minLength={6}
                  placeholder="Minimum 6 caracteres"
                  className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block font-sans text-sm font-medium text-foreground"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Confirmez votre mot de passe"
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
                  Creation en cours...
                </span>
              ) : (
                "Creer mon compte"
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="font-sans text-sm text-muted-foreground">
            Deja un compte?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="font-sans text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            ← Retour a l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
