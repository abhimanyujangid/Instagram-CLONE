import React from 'react'

const Home = () => {
  return (
    <div className='home flex w-full h-screen'>
      <div className='home__left border w-1/5'>
        <div className='home__left__top  h-1/6 justify-center flex items-center text-3xl border-b font-mono'>Socialite</div>
        <div className='home__left__middle  h-3/5 '>

        </div>
        <div className='home__left__bottom h-1/6 border-t   items-center'>
          <div className="p-4 border-t border-neutral-200/20">
            <div className="flex items-center">
              <img src="https://avatar.iran.liara.run/public" alt="User" className="w-10 h-10 rounded-full transition-opacity duration-300 opacity-100" loading="lazy" />
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-700">John Doe</p>
                <p className="text-xs text-neutral-500">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
        <div>profile</div>
      </div>
      <div className='home__right bg-gray-200 w-4/5'>asdfas</div>
    </div>
  )
}

export default Home
