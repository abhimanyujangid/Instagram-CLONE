import { useState } from 'react';
import {
  IconUserBitcoin,
  IconHandClick,
  IconHome2,
  IconLogout,
  IconMoonStars,
  IconSettings,
  IconSun,
  IconMessage,
  IconBell,
  IconSearch,
} from '@tabler/icons-react';
import { Center, Stack, Tooltip, UnstyledButton, useMantineColorScheme } from '@mantine/core';
import classes from './NavbarMinimal.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconUserBitcoin, label: 'Profile' },
  { icon: IconMessage, label: 'Message' },
  { icon: IconBell, label: 'Notification' },
  { icon: IconSearch, label: 'Explore' },
  { icon: IconSettings, label: 'Setting' },
];

export function NavbarMinimal({ setSelectNav }: { setSelectNav: (label: string) => void }) {
  const [active, setActive] = useState(0); 
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const handleSelectNav = (index: number, label: string) => {
    setActive(index);
    setSelectNav(label);
  };

  return (
    <nav className={classes.navbar}>
      <Center>
        <IconHandClick />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {mockdata.map((link, index) => (
            <NavbarLink
              {...link}
              key={link.label}
              active={index === active}
              onClick={() => handleSelectNav(index, link.label)}
            />
          ))}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        {/* Light/Dark Mode Toggle */}
        <NavbarLink
          icon={colorScheme === 'dark' ? IconSun : IconMoonStars}
          label="Toggle theme"
          onClick={toggleColorScheme}
        />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}
