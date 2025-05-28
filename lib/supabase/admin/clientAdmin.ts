import { createBrowserClient } from "@supabase/ssr";

export const createAdminClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
    );
