"use server";

import { createClient } from "@/lib/supabase/server";
import { IAuth, IResponse } from "@/types/auth";

export async function loginUser({
    email,
    password,
}: IAuth): Promise<IResponse> {
    if (!email || !password)
        return {
            error: {
                message: "Todos los campos son obligatorios.",
            },
            success: false,
        };

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return { error };
    

    return { success: true };
}
