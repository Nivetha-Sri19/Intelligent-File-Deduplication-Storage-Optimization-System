import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import type { ReactNode } from 'react';

type Props = {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: string;
  trend?: string;
  tone?: 'purple' | 'teal' | 'pink' | 'gold';
};

const tones = {
  purple: { bg: 'rgba(124,108,255,.14)', color: '#9b91ff' },
  teal: { bg: 'rgba(33,212,179,.12)', color: '#49e4c8' },
  pink: { bg: 'rgba(239,91,180,.12)', color: '#ff79c8' },
  gold: { bg: 'rgba(244,180,0,.12)', color: '#ffd45c' },
};

export default function StatCard({ label, value, icon, accent, trend, tone = 'purple' }: Props) {
  const t = tones[tone];
  return (
    <Card className="dedup-hover" sx={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Box sx={{ position: 'absolute', inset: '0 auto auto 0', width: '45%', height: 1, background: `linear-gradient(90deg, ${t.color}, transparent)` }} />
      <CardContent sx={{ p: 2.4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={1.1} minWidth={0}>
            <Typography color="text.secondary" variant="body2" fontWeight={650}>{label}</Typography>
            <Typography variant="h4" sx={{ whiteSpace: 'nowrap' }}>{value}</Typography>
            {trend && <Typography variant="caption" sx={{ color: '#57dfbd', fontWeight: 700 }}>{trend}</Typography>}
          </Stack>
          <Box sx={{ p: 1.35, borderRadius: 3, bgcolor: accent || t.bg, color: t.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
