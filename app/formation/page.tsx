import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import { FormationHeader } from "@/components/formation-header"
import { CourseContent } from "@/components/course-content"

export default async function FormationPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const user = {
    email: "galaxydroidlenny@gmail.com",
    id: "local-admin"
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-repeat"
      style={{ backgroundImage: "url('/images/dollar-bg-bright.jpg')" }}
    >
      <div className="absolute inset-0 z-0 bg-black/20" />

      <div className="relative z-10">
        <FormationHeader email={user.email || ""} />

        <main>
          <section className="py-10">
            <div className="mx-auto max-w-7xl px-6">
              <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
                Votre Formation
              </h1>

              <p className="mt-2 font-sans text-lg text-white/90">
                Progressez à votre rythme dans les 10 modules.
              </p>
            </div>
          </section>

          <CourseContent />
        </main>
      </div>
    </div>
  )
}
