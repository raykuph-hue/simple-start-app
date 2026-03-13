import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@supabase/supabase-js";

// Tailwind helper stays the same
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Supabase client setup
// Correct way to call Supabase in a Vite project
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
