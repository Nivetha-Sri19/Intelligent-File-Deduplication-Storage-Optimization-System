import { useState } from 'react';
import {
  AppBar, Avatar, Box, Button, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery, useTheme,
  Stack, Divider,
} from '@mui/material';
import { FaBars, FaTachometerAlt, FaFolder, FaCopy, FaTrashAlt, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Glow from '../components/Glow';

const items = [
  ['/', 'Overview', FaTachometerAlt],
  ['/files', 'Files', FaFolder],
  ['/duplicates', 'Duplicate Radar', FaCopy],
  ['/history', 'Deletion History', FaTrashAlt],
] as const;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const nav = useNavigate();
  const loc = useLocation();
  const user = JSON.parse(localStorage.getItem('dedup_user') || 'null');
  const logout = () => { localStorage.clear(); nav('/login'); };

  const drawer = (
    <Box sx={{ width: 258, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1.3} alignItems="center" sx={{ px: 1, py: 1.6 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 3, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#7c6cff,#21d4b3)', boxShadow: '0 10px 30px rgba(124,108,255,.3)' }}>
          <FaShieldAlt color="white" size={18} />
        </Box>
        <Box>
          <Typography fontWeight={900} fontSize={19}>Deduply</Typography>
          <Typography variant="caption" color="text.secondary">Smart storage. No clutter.</Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,.06)' }} />
      <List sx={{ p: 0 }}>
        {items.map(([to, label, Icon]) => (
          <ListItemButton
            key={to}
            component={NavLink}
            to={to}
            selected={loc.pathname === to}
            onClick={() => setOpen(false)}
            sx={{ borderRadius: 3, my: .55, minHeight: 48, '&.Mui-selected': { background: 'linear-gradient(90deg, rgba(124,108,255,.28), rgba(124,108,255,.06))', border: '1px solid rgba(124,108,255,.18)' }, '&.Mui-selected .MuiListItemIcon-root': { color: '#9b91ff' } }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: 'text.secondary' }}><Icon size={17} /></ListItemIcon>
            <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 650, fontSize: 14 }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto' }}>
        <Box sx={{ p: 1.5, mb: 1.5, borderRadius: 3, bgcolor: 'rgba(124,108,255,.07)', border: '1px solid rgba(124,108,255,.10)' }}>
          <Typography variant="caption" color="text.secondary">SECURITY</Typography>
          <Typography variant="body2" fontWeight={700} sx={{ mt: .5 }}>SHA-256 fingerprinting active</Typography>
        </Box>
        <Button fullWidth startIcon={<FaSignOutAlt size={14} />} onClick={logout} sx={{ color: 'text.secondary' }}>Sign out</Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Glow />
      {mobile ? <Drawer open={open} onClose={() => setOpen(false)}>{drawer}</Drawer> : <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { background: 'rgba(5,8,22,.86)', backdropFilter: 'blur(22px)', borderRight: '1px solid rgba(255,255,255,.06)' } }}>{drawer}</Drawer>}
      <Box sx={{ ml: mobile ? 0 : '258px', position: 'relative' }}>
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(20px)', background: 'rgba(5,8,22,.55)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <Toolbar sx={{ minHeight: 70 }}>
            {mobile && <IconButton onClick={() => setOpen(true)} sx={{ mr: 1 }}><FaBars size={19} /></IconButton>}
            <Box sx={{ display: { xs: 'none', md: 'block' }, width: 420, maxWidth: '45%' }}>
              <Box sx={{ px: 2, py: 1.1, borderRadius: 3, bgcolor: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.06)' }}>
                <Typography variant="body2" color="text.secondary">Search files, duplicates...</Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main', fontWeight: 800 }}>{user?.email?.[0]?.toUpperCase() || 'U'}</Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight={750}>{user?.email?.split('@')[0] || 'User'}</Typography>
                <Typography variant="caption" color="text.secondary">Storage workspace</Typography>
              </Box>
            </Stack>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1600, mx: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
}
