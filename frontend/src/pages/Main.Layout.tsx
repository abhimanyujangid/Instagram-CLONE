import { NavbarMinimal } from '@/components/NavBar/NavbarMinimal';
import { Container, Flex, Text, Paper, Box } from '@mantine/core';
import { useState } from 'react';
import { useDidUpdate } from '@mantine/hooks';
import { Outlet, useNavigate } from 'react-router-dom';
export function MainLayout() {
  const [selectNav, setSelectNav] = useState<string>('Home');
  const navigate = useNavigate();

  // 	Avoiding first-render execution, running logic only when dependencies change
  useDidUpdate(() => {
    switch (selectNav) {
      case 'Home':
        navigate('/');
        break;
      case 'Message':
        navigate('/messages');
        break;
      case 'Setting':
        navigate('/setting');
        break;
      case 'Notification':
        navigate('/notification');
        break;
      case 'Profile':
        navigate('/profile');
        break;
      case 'Explore':
        navigate('/explore');
        break;
      default:
        navigate('/');
    }
  }, [selectNav]);

  return (
    <Flex style={{ height: '100vh' }}>
      <Box style={{ width: 80, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavbarMinimal setSelectNav={setSelectNav} />
      </Box>
      <Container fluid style={{ flex: 1, padding: '20px' }}>
       <Outlet/>
      </Container>
    </Flex>
  );
}
