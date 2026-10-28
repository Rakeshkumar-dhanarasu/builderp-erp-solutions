"use client";

import api, { LoginResponse, ErrorResponse } from '@/utilities/connectAxios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Box,
  Checkbox,
  Group,
  Alert,
  Anchor,
  Container,
} from '@mantine/core';
import { IconAlertCircle, IconLock, IconUser } from '@tabler/icons-react';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();

  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Validation States
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Request & Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');

    if (!username.trim()) {
      setUsernameError('Email or Username is required');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

   try {
  const response = await api.post<LoginResponse>('/api/pms/login', {
    username: username.trim(),
    password: password,
  });

  console.log(response);

  if (response.status === 200) {
    router.push('/menu');
  }

} catch (error: unknown) {

  console.error(error);

  if (axios.isAxiosError<ErrorResponse>(error)) {

    if (error.response?.status === 401) {

      setErrorMsg(
        error.response.data?.error ||
        'Invalid username or password.'
      );

    } else if (!error.response) {

      setErrorMsg(
        'Unable to connect to the server. Please try again.'
      );

    } else {

      setErrorMsg(
        'An unexpected authentication error occurred. Please try again.'
      );
    }

  } else {

    setErrorMsg(
      'An unknown error occurred. Please try again.'
    );
  }

} finally {

  setLoading(false);
}};

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setInfoMsg('Password reset functionality will be available soon. Please contact your system administrator.');
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        backgroundImage: `
          linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)),
          url('/image-background.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0f172a', // Fallback color if background image is missing
      }}
    >
      {/* HEADER */}
      <Box
        component="header"
        style={{
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
        }}
      >
        <Box>
          <Text
            fw={900}
            size="xl"
            c='brandOrange'
            style={{
              letterSpacing: '1px',
              lineHeight: 1.1,
            }}
          >
            Al-Mahrooqi International LLC
          </Text>
          <Text size="xs" c="dimmed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Project Management System
          </Text>
        </Box>
        <Text
          size="sm"
          visibleFrom="sm"
          style={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}
        >
          Manage projects. Control resources. Deliver with confidence.
        </Text>
      </Box>

      {/* LOGIN CONTENT AREA */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
        }}
      >
        <Container size="xs" style={{ width: '100%', maxWidth: '420px' }}>
          <Paper
            radius="md"
            p="xl"
            withBorder
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Stack gap="lg">
              <Box>
                <Title order={2} size="h3" fw={700} c="brandOrange">
                  Welcome back
                </Title>
                <Text size="sm" c="dimmed" mt={4}>
                  Sign in to your account to continue
                </Text>
              </Box>

              {errorMsg && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                  radius="sm"
                  title="Authentication Error"
                >
                  {errorMsg}
                </Alert>
              )}

              {infoMsg && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="blue"
                  variant="light"
                  radius="sm"
                >
                  {infoMsg}
                </Alert>
              )}

              <form onSubmit={handleLogin} noValidate>
                <Stack gap="md">
                  <TextInput
                    label="Username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.currentTarget.value)}
                    error={usernameError}
                    leftSection={<IconUser size={16} color="gray" />}
                    required
                    disabled={loading}
                    autoComplete="username"
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    error={passwordError}
                    leftSection={<IconLock size={16} color="gray" />}
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />

                  <Group justify="space-between" mt={4}>
                    <Checkbox
                      label="Remember me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.currentTarget.checked)}
                      disabled={loading}
                      size="sm"
                    />
                    <Anchor
                      component="button"
                      type="button"
                      size="sm"
                      onClick={handleForgotPassword}
                      style={{ textDecoration: 'none' }}
                    >
                      Forgot password?
                    </Anchor>
                  </Group>

                  <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    color="brandOrange" // Falls back to Mantine default primary if brandOrange is not configured
                    size="md"
                    radius="sm"
                    mt="xs"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        component="footer"
        style={{
          padding: '16px 32px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          © 2026 BUILDERP. All rights reserved.
        </Text>
        <Group gap="md">
          <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }}>
            Privacy Policy
          </Text>
          <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }}>
            Terms of Use
          </Text>
          <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }}>
            Support
          </Text>
        </Group>
      </Box>
    </Box>
  );
}