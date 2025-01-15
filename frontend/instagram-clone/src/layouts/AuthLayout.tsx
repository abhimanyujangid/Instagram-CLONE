import { LightbulbIcon, MoonIcon, SunIcon } from "lucide-react"; // MoonIcon and SunIcon added
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../features/theme/themeSlice"; // Import setTheme action
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme)); // Toggle theme state
  };

  return (
    <div
      className={`auth-layout h-screen ${
        currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Top bar */}
      <div className="flex justify-between items-center p-4">
        {/* App name */}
        <div className="text-xl font-bold">Socialize</div>

        {/* Theme toggle icon */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {currentTheme === "dark" ? (
            <MoonIcon size={24} className="text-white" />
          ) : (
            <SunIcon size={24} className="text-black" />
          )}
        </button>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
