"use server";

import { createAdminClient } from "@/lib/supabase/admin/serverAdmin";
import { IAuthRegister, IResponseRegisterUser } from "@/types/auth";
import { generateRandomPassword } from "@/utils/generateRandomPassword";

export const createUser = async (
    data: IAuthRegister
): Promise<IResponseRegisterUser> => {
    // const supabase = createClient();
    const supabase = await createAdminClient();
    const passwordGenerated = generateRandomPassword(12);

    const { data: user, error } = await supabase.auth.admin.createUser({
        email: data.email,
        password: passwordGenerated,
        email_confirm: true,
    });

    if (error) {
        return {
            error: {
                message: error.message,
            },
        };
    }

    const { error: insertError } = await supabase.from("users").insert({
        id: user.user.id,
        national_id: data.national_id,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
    });

    if (insertError) {
        return {
            error: {
                message: insertError.message,
            },
        };
    }

    return {
        success: true,
        password: passwordGenerated,
    };
};

export const deleteUser = async (id_user: string) => {
    const supabase = await createAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(id_user, {
        user_metadata: {
            disabled: true,
        },
    });

    if (error) {
        return {
            error: {
                message: error.message,
            },
        };
    }

    const { error: deleteError } = await supabase.from("users").update({ id_deleted: true }).eq("id", id_user);

    if (deleteError) {
        return {
            error: {
                message: deleteError.message,
            },
        };
    }

    return {
        success: true,
    };
};
