import React from 'react'
import { LogInIcon } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const Footer = () => {

    const navigate = useNavigate()
    const handelLogout = () => {
        console.log('Logout')
    }

  return (
        <div className="p-4  border-neutral-200/20 border-t flex items-center">
            <div className="flex items-center cursor-pointer" onClick={()=>{navigate('/profile')}}>
              <img src="https://avatar.iran.liara.run/public" alt="User" className="w-10 h-10 rounded-full transition-opacity duration-300 opacity-100" loading="lazy" />
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-700">Username</p>
                <p className="text-xs text-neutral-500">john@example.com</p>
              </div>
            </div>
            <LogInIcon className="w-5 h-5 ml-auto text-neutral-500" onClick={handelLogout} />
          </div>
  )
}

export default Footer