import { NavbarMinimal } from '@/components/NavBar/NavbarMinimal';
import { Container, Flex, Text, Paper, Box } from '@mantine/core';

export function HomePage() {
  return (
    <Flex style={{ height: '100vh' }}>
      <Box  style={{ width: 80, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavbarMinimal />
      </Box>
      <Container fluid style={{ flex: 1, padding: '20px' }}>
        <Text size="xl" weight={700} mb="md">
          Welcome to Dashboard
        </Text>
        <Text size="sm" color="dimmed">
          Manage your 3D printing services efficiently.
        </Text>
      </Container>
    </Flex>
  );
}
