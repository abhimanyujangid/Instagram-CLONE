import * as LucideIcons from 'lucide-react'; 
import { navData } from '../../constants/constant';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';



const NavBar = () => {
    const [active, setActive] = useState(1);
    
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
              className={`nav__item flex items-center gap-4 py-2 px-3 w-full transition-all duration-200 hover:bg-gray-200 ${active === item.id ? 'bg-gray-100' : ''}`}
                onClick={() => handleClick(item.id)}
            >
              {IconComponent ? (
                <IconComponent className="text-gray-700" />
              ) : (
                <LucideIcons.HelpCircle className="text-gray-700" /> // Fallback icon
              )}
              <p className={`${active === item.id ? 'font-extrabold ' : ''}text-gray-800 font-medium capitalize font-mono`}>{item.name}</p>
            </Link>
          );
        })}
    </div>
  );
};

export default NavBar;
