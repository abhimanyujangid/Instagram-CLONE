export const isValidPassword = (password: string) => {
    const passwordRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$"
    );
    return passwordRegex.test(password) && password.length >= 6 && password.length <= 20;
};

export const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length >= 3 && email.length <= 254;
};

export const isConfirmPasswordMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
};
