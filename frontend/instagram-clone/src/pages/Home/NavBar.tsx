import * as LucideIcons from 'lucide-react'; 
import { navData } from '../../constants/constant';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/hook';



const NavBar = () => {
    const [active, setActive] = useState(1);
    const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  
    
    // if route are change then active class will be change

    
    const handleClick = (id: number) => {
      setActive(id);
    };
  return (
    <div className="nav flex flex-col w-full h-auto ">
      {navData &&
        navData.map((item: any) => {
          const IconComponent = LucideIcons[item.icon as keyof typeof LucideIcons];
          return (
            <Link
              to={`/${item.name}`}
              key={item.id}
              className={`nav__item flex items-center gap-4 py-2 px-3 w-full transition-all duration-200 ${currentTheme === 'dark' ? 'hover:bg-gray-500' : 'hover:bg-gray-400'} ${active === item.id ? `${currentTheme === 'dark' ? 'bg-gray-500' : 'bg-gray-300'}` : ''}`}
                onClick={() => handleClick(item.id)}
            >
              {IconComponent ? (
                <IconComponent className={currentTheme === 'dark' ? 'text-white' : 'text-black'} />
              ) : (
                <LucideIcons.HelpCircle className="text-gray-700" /> // Fallback icon
              )}
              <p className={`${active === item.id ? 'font-extrabold ' : ''}${currentTheme === 'dark' ? 'text-white' : 'text-black'} font-medium capitalize `}>{item.name}</p>
            </Link>
          );
        })}
    </div>
  );
};

export default NavBar;
