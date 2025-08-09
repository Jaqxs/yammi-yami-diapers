import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Pick up Supabase credentials from the public (browser-safe) variables first.
 * These env-vars already exist in your project, as shown in the chat metadata:
 *   – SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL
 *   – SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY
 *
 * They’re automatically available in both server and client runtimes when you
 * deploy or run `vercel dev`, so no `.env` file is needed.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast with a clear message so the problem is obvious in the log/output
  throw new Error(
    "Missing Supabase environment variables.\n" +
      "Make sure SUPABASE_NEXT_PUBLIC_SUPABASE_URL and " +
      "SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY are defined in your project.",
  )
}

/**
 * Re-use the client across HMR reloads in development to prevent
 * “Duplicate realtime subscription” warnings and excessive socket usage.
 */
let _supabase: SupabaseClient | undefined

declare global {
  // eslint-disable-next-line no-var
  var __supabase__: SupabaseClient | undefined
}

if (typeof window === "undefined") {
  // On the server we create a new client per request (best practice)
  _supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // On the client we keep a singleton on the global object
  if (!global.__supabase__) {
    global.__supabase__ = createClient(supabaseUrl, supabaseAnonKey)
  }
  _supabase = global.__supabase__
}

export const supabase = _supabase!
