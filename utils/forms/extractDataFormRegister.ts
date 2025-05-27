export const extractDataFormRegister = (formData: FormData) => {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const cedula = formData.get("cedula") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    return { firstName, lastName, cedula, email, password, confirmPassword };
};
