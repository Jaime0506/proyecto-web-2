"use server";

import { createAdminClient } from "@/lib/supabase/admin/serverAdmin";
import { createClient } from "@/lib/supabase/server";
import { IAuthRegister } from "@/types/auth";
import { IResponse } from "@/types/common";

export async function registerUser({
    email,
    password,
    first_name,
    last_name,
    national_id,
}: IAuthRegister): Promise<IResponse> {
    if (!email || !password || !first_name || !last_name || !national_id)
        return {
            error: {
                message: "Todos los campos son obligatorios.",
            },
            success: false,
        };

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) return { error };

    const userId = data.user?.id;

    if (!userId)
        return { error: { message: "No se pudo obtener el ID de usuario." } };

    const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        first_name,
        last_name,
        national_id,
    });

    if (insertError) {
        await supabase.auth.signOut();
        
        const supabaseAdmin = await createAdminClient();
        await supabaseAdmin.auth.admin.deleteUser(userId);

        return { error: insertError };
    }

    return { success: true };
}
