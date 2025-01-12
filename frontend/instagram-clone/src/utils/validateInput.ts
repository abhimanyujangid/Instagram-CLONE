export const isValidPassword = (password: string) => password.length >= 3 && password.length <= 20;

export const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length >= 3 && email.length <= 254;
};

export const isConfirmPasswordMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
};
