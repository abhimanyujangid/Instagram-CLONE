import Footer from "@/pages/Home/Footer"
import NavBar from "@/pages/Home/NavBar"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/hook"
import { getLoggedInUser } from "../features/auth/authSlice"
import { Moon, MoonIcon, SunIcon } from "lucide-react"
import { setTheme } from "@/features/theme/themeSlice"


const MainLayout = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  // toggle theme
  const toggleTheme = () => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      dispatch(setTheme(newTheme)); // Toggle theme state
    };
  
  // check if user is logged in
  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  return (
    <div className={`home flex  w-full h-screen ${currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      <div className='home__left border w-1/5'>

        {/* Header */}
        <div className='home__left__top  h-1/6  border-b flex justify-evenly items-center text-3xl '>
        <p>Socialize</p>
        <span>
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
        </span>
        </div>

        {/* Middle */}
        <div className='home__left__middle  h-2/3 w-full  '>
          <NavBar />
        </div>

        {/* Bottom */}
        <div className='home__left__bottom h-1/6  pt-8  items-center'>
          <Footer />
        </div>

      </div>
      <div className={`${currentTheme === "dark" ? "bg-gray-900" : "bg-gray-100"} home__right w-4/5 h-full flex items-center justify-center`}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
