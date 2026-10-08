import { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  FaShieldAlt,
  FaBolt,
} from 'react-icons/fa';

import { auth } from '../api/services';

import { useNavigate } from 'react-router-dom';

import Glow from '../components/Glow';

export default function Login() {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [err, setErr] =
    useState('');

  const nav = useNavigate();

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setErr('');

    try {
      const response =
        await auth.login(
          email,
          password
        );

      localStorage.setItem(
        'dedup_token',
        response.data.access_token
      );

      localStorage.setItem(
        'dedup_user',
        JSON.stringify(
          response.data.user
        )
      );

      nav('/');
    } catch (e: any) {
      setErr(
        e.response?.data?.detail ||
          'Unable to sign in'
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: {
          xs: 2,
          md: 4,
        },
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 15% 20%, rgba(124,108,255,.18), transparent 35%), radial-gradient(circle at 85% 80%, rgba(33,212,179,.12), transparent 35%)',
      }}
    >
      <Glow />

      <Box
        sx={{
          width: '100%',
          maxWidth: 1180,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1.25fr .75fr',
          },
          gap: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Premium Product Panel */}
        <Box
          sx={{
            display: {
              xs: 'none',
              md: 'flex',
            },
            p: 5,
            borderRadius: 5,
            background:
              'linear-gradient(145deg,rgba(22,29,57,.90),rgba(7,13,28,.78))',
            border:
              '1px solid rgba(124,108,255,.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow */}
          <Box
            sx={{
              position: 'absolute',
              width: 360,
              height: 360,
              borderRadius: '50%',
              right: -120,
              top: -130,
              background:
                'radial-gradient(circle,rgba(124,108,255,.35),transparent 68%)',
            }}
          />

          <Stack
            justifyContent="space-between"
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
            }}
          >
            {/* Brand */}
            <Stack
              direction="row"
              spacing={1.3}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 3,
                  display: 'grid',
                  placeItems: 'center',
                  background:
                    'linear-gradient(135deg,#7c6cff,#21d4b3)',
                  boxShadow:
                    '0 8px 30px rgba(124,108,255,.28)',
                }}
              >
                <FaShieldAlt color="white" />
              </Box>

              <Box>
                <Typography
                  fontWeight={900}
                  fontSize={20}
                >
                  Deduply
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Smart storage. No clutter.
                </Typography>
              </Box>
            </Stack>

            {/* Hero */}
            <Box>
              <Typography
                variant="h2"
                sx={{
                  maxWidth: 560,
                  fontWeight: 900,
                  lineHeight: 1.08,
                }}
              >
                Turn duplicate files into{' '}
                <Box
                  component="span"
                  sx={{
                    color: '#21d4b3',
                  }}
                >
                  reclaimable space.
                </Box>
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 2,
                  maxWidth: 500,
                  lineHeight: 1.7,
                }}
              >
                Fingerprint every upload,
                understand your storage
                footprint and safely remove
                redundant content.
              </Typography>

              <Stack
                direction="row"
                spacing={1.2}
                sx={{
                  mt: 3,
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Chip
                  icon={
                    <FaBolt size={12} />
                  }
                  label="SHA-256 analysis"
                />

                <Chip
                  icon={
                    <FaShieldAlt size={12} />
                  }
                  label="Safe deletion"
                />
              </Stack>
            </Box>

            {/* Technology */}
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Enterprise-style file intelligence
              · FastAPI · Celery · Redis · MySQL
            </Typography>
          </Stack>
        </Box>

        {/* Login Card */}
        <Card
          sx={{
            borderRadius: 5,
            background:
              'rgba(12,18,35,.88)',
            border:
              '1px solid rgba(255,255,255,.08)',
            backdropFilter:
              'blur(20px)',
            boxShadow:
              '0 25px 80px rgba(0,0,0,.35)',
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 3,
                sm: 5,
              },
            }}
          >
            <Stack spacing={3}>
              {/* Mobile Brand */}
              <Stack
                direction="row"
                spacing={1.3}
                alignItems="center"
                sx={{
                  display: {
                    xs: 'flex',
                    md: 'none',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 3,
                    display: 'grid',
                    placeItems: 'center',
                    background:
                      'linear-gradient(135deg,#7c6cff,#21d4b3)',
                  }}
                >
                  <FaShieldAlt color="white" />
                </Box>

                <Box>
                  <Typography
                    fontWeight={900}
                    fontSize={20}
                  >
                    Deduply
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Smart storage. No clutter.
                  </Typography>
                </Box>
              </Stack>

              {/* Login Heading */}
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={900}
                >
                  Welcome back
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.7 }}
                >
                  Enter your workspace and
                  manage your storage.
                </Typography>
              </Box>

              {/* Error */}
              {err && (
                <Alert severity="error">
                  {err}
                </Alert>
              )}

              {/* Form */}
              <Box
                component="form"
                onSubmit={submit}
              >
                <Stack spacing={2}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    required
                    fullWidth
                  />

                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    required
                    fullWidth
                  />

                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    sx={{
                      minHeight: 50,
                      borderRadius: 3,
                      fontWeight: 800,
                      background:
                        'linear-gradient(135deg,#7c6cff,#21d4b3)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg,#6d5dfc,#18c9aa)',
                      },
                    }}
                  >
                    Enter workspace
                  </Button>
                </Stack>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
              >
                Your files stay protected by
                authenticated access.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}