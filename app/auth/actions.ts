"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email et mot de passe requis" }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Translate common errors to French
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email ou mot de passe incorrect" }
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Veuillez confirmer votre email avant de vous connecter" }
    }
    return { error: error.message }
  }

  redirect("/formation")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!email || !password) {
    return { error: "Email et mot de passe requis" }
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas" }
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caracteres" }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://formation.goalphaleo.fr'}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes("User already registered")) {
      return { error: "Un compte existe deja avec cet email" }
    }
    if (error.message.includes("Email signups are disabled")) {
      return { error: "Les inscriptions par email sont desactivees. Contactez l'administrateur." }
    }
    return { error: error.message }
  }

  return { success: "Compte cree! Verifiez votre email pour confirmer votre inscription." }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
