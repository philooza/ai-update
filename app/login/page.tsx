"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-6 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-cyan-950/30">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100">
          <ArrowLeft className="h-4 w-4" /> Back to ai-update
        </Link>
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-cyan-200/70">admin access</p>
        <h1 className="mb-3 text-3xl font-semibold">Sign in to ai-update</h1>
        <p className="mb-8 text-sm leading-6 text-white/60">
          Google sign-in is wired through Supabase Auth. Publishing controls can be added behind this login when needed.
        </p>
        <Button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="h-11 w-full rounded-full bg-cyan-300 text-black hover:bg-cyan-200"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue with Google
        </Button>
        {error ? <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
      </section>
    </main>
  );
}
