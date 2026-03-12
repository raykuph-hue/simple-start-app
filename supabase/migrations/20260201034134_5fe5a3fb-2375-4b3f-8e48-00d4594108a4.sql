-- Fix the overly permissive policy on analytics_summary
-- Drop the permissive policy
DROP POLICY IF EXISTS "Service can manage analytics" ON public.analytics_summary;

-- Create proper admin-only policies for management
CREATE POLICY "Admins can manage analytics"
ON public.analytics_summary
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));