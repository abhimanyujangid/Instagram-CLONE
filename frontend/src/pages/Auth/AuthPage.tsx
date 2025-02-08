import { AuthenticationForm } from '@/components/Auth/AuthenticationForm';
import { Center } from '@mantine/core';
import React from 'react';

const AuthPage = () => {
  return (
    <Center style={{ height: '100vh' }}>
      <AuthenticationForm />
    </Center>
  );
};

export default AuthPage;
