export const validateEmail = (email: string) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
};

export const validateText = (text: string) => {
    const regex = /^[A-Za-z]{4,}$/; // Asegura que el texto tenga al menos 4 letras y no contenga números
    return regex.test(text);
};

export const validateCedula = (cedula: string) => {
    const regex = /^[0-9]+$/;
    return regex.test(cedula);
};

export const validatePassword = (password: string, confirmPassword: string) => {
    return password.length >= 6 && password === confirmPassword;
};
