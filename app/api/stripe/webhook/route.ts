import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    const resendKey = process.env.RESEND_API_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!stripeKey || !resendKey || !supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Missing environment variables" },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeKey)

    const resend = new Resend(resendKey)

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    )

    const body = await req.text()

    const headersList = await headers()

    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      )
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // reste du code inchangé
