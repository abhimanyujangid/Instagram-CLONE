import { LogInIcon, UserCircle } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../hooks/hook';
import { logoutUser } from "../../features/auth/authSlice";
import apiClient from "@/services/apiClient";
import { toast } from "react-toastify";

const Footer = () => {
  const dispatch = useAppDispatch()
  const { loading, error, isAuthenticated, user } = useAppSelector(state => state.auth);

    const navigate = useNavigate()
    // const handelLogout = () => {
    //     dispatch(logoutUser());
    //     localStorage.removeItem('accessToken');
    // }
const handelLogout = async () => {
   await apiClient.post('/users/logout'); 
  localStorage.removeItem('accessToken');
  navigate('/auth/login');
  toast.success('Logout successful');
}

  return (
        <div className="p-4  border-neutral-200/20 border-t flex items-center">
            <div className="flex items-center cursor-pointer" onClick={()=>{navigate('/profile')}}>
              {user?.message?.avatar ?
                <img src={user?.message?.profilePicture} alt="User" className="w-10 h-10 rounded-full " loading="lazy" /> :
                <UserCircle className="w-10 h-10 text-neutral-400" />
               }
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-700">{user?.message?.username}</p>
                <p className="text-xs text-neutral-500">{user?.message?.email}</p>
              </div>
            </div>
            <LogInIcon className="w-5 h-5 ml-auto text-neutral-500 cursor-pointer" onClick={handelLogout} />
          </div>
  )
}

export default Footer