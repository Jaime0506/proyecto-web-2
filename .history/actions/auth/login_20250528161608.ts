"use server";

import { createClient } from "@/lib/supabase/server";
import { IAuth, IResponse, IUserDB } from "@/types/auth";

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

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return { error };

    if (data.user.user_metadata.disabled) {
        await supabase.auth.signOut();

        return {
            error: {
                message: "Su usuario no existe, Intente con otro",
            },
        };
    }

    const { data: user, error: ErrorTableUsers } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

    if (ErrorTableUsers) return { error: ErrorTableUsers };

    const currentUser = user as IUserDB;

    if (currentUser.deleted) {
        await supabase.auth.signOut();

        return {
            error: {
                message: "Su usuario no existe, Intente con otro",
            },
        };
    }

    //if (currentUser.status) {
        //await supabase.auth.signOut();

        //return {
          //  error: {
                //message: "Su usuario se encuentra desactivado, contacte con el administrador",
            //},
        //};
    //}

    return { success: true };
}
