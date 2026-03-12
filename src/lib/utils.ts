import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@supabase/supabase-js";

// Tailwind helper stays the same
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Supabase client setup
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);