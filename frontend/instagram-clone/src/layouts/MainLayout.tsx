import Footer from "@/pages/Home/Footer"
import NavBar from "@/pages/Home/NavBar"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
  return (
    <div className='home flex w-full h-screen'>
      <div className='home__left border w-1/5'>

      {/* Header */}
        <div className='home__left__top  h-1/6 justify-center border-b flex items-center text-3xl  font-mono'>Socialite</div>

        {/* Middle */}
        <div className='home__left__middle  h-2/3 w-full  '>
          <NavBar/>
        </div>

        {/* Bottom */}
        <div className='home__left__bottom h-1/6  pt-8  items-center'>
          <Footer/>
        </div>

      </div>
      <div className='home__right bg-gray-200 w-4/5 flex justify-center items-center'>
      <Outlet/> 
      </div>
    </div>
  )
}

export default MainLayout
