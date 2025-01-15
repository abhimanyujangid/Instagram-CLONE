
export const saveThemeToStorage = (theme: string) => {
    localStorage.setItem("theme", theme);
};

export const getThemeFromStorage = (): string => {
    return localStorage.getItem("theme") || "light"; 
};
