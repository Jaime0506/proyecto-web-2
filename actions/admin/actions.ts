"use server";

import { createAdminClient } from "@/lib/supabase/admin/serverAdmin";
import {
    IAuthRegister,
    IAuthUpdate, 
} from "@/types/auth";
import { IResponseRegisterUser } from "@/types/common";
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

    const { error: deleteError } = await supabase
        .from("users")
        .update({ deleted: true })
        .eq("id", id_user);

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

export const updateUser = async (id_user: string, data: IAuthUpdate) => {
    const supabase = await createAdminClient();

    const { error: deleteError } = await supabase
        .from("users")
        .update({ ...data })
        .eq("id", id_user);

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

export const getApplications = async () => {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return {
            error: {
                message: error.message,
            },
        };
    }

    return {
        data,
    };
}