"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, TextInput, PasswordInput, Button, Title, Text, Stack, Box } from '@mantine/core';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Alerting just to prove the button works and form captures data correctly
    alert(`Logging in with User: ${username}`);
    
    // Bounces the user directly over to your sales dashboard path
    router.push('/menu');
  };

  return (
    <Box 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: 'var(--mantine-color-body)', // Soft gray background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card withBorder shadow="sm" p="xl" radius="md" style={{ width: 380 }}>
        <Stack gap="xs" align="center" mb="lg">
          <Title order={2} style={{ color: 'var(--mantine-color-brandOrange-6)', letterSpacing: '-0.5px' }}>
            BUILDERP
          </Title>
          <Text size="xs" c="dimmed" fw={500}>
            Enter operational credentials to clear terminal lock
          </Text>
        </Stack>

        <form onSubmit={handleLogin}>
          <Stack gap="md">
            <TextInput
              label="Username"
              placeholder="e.g., admin_01"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <PasswordInput
              label="System Passcode"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" color="brandOrange.6" fullWidth mt="md" size="md">
              Sign In
            </Button>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}