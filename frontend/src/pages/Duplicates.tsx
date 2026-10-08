import { useEffect, useState } from 'react';
import { Alert, Box, Card, CardContent, Chip, Collapse, IconButton, Stack, Typography, Button } from '@mui/material';
import { FaChevronDown, FaCopy, FaShieldAlt } from 'react-icons/fa';
import { duplicates } from '../api/services';
import type { DuplicateGroup } from '../api/types';
import { bytes, date } from '../utils/format';
import EmptyState from '../components/EmptyState';

export default function Duplicates() {
  const [groups, setGroups] = useState<DuplicateGroup[]>([]);
  const [open, setOpen] = useState<number | null>(0);
  const [err, setErr] = useState('');
  useEffect(() => { duplicates.list().then(r => setGroups(r.data)).catch(e => setErr(e.response?.data?.detail || 'Could not load duplicates')); }, []);

  return <Stack spacing={3}>
    <Box sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 4, background: 'linear-gradient(125deg,rgba(239,91,180,.10),rgba(124,108,255,.07))', border: '1px solid rgba(239,91,180,.12)' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}><Box><Typography color="text.secondary" fontWeight={700}>CONTENT INTELLIGENCE</Typography><Typography variant="h3" sx={{ mt: .5 }}>Duplicate radar</Typography><Typography color="text.secondary" sx={{ mt: .8 }}>Identical content, regardless of filename. Inspect every fingerprint group before reclaiming space.</Typography></Box><Box sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, p: 1.5, borderRadius: 3, bgcolor: 'rgba(239,91,180,.10)', color: '#ff79c8' }}><FaCopy size={24} /></Box></Stack>
    </Box>
    {err && <Alert severity="error">{err}</Alert>}
    {groups.length ? groups.map((g, i) => <Card key={g.group_hash} className="dedup-hover"><CardContent sx={{ p: 2.5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2}>
        <Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: 'rgba(239,91,180,.10)', color: '#ff79c8', display: 'grid', placeItems: 'center' }}><FaCopy /></Box><Box><Stack direction="row" spacing={1} alignItems="center"><Chip label={`Group ${i + 1}`} size="small" color="secondary" /><Typography fontWeight={800}>{g.files.length} identical files</Typography></Stack><Typography variant="caption" color="text.secondary">SHA-256 · {g.group_hash.slice(0, 24)}…</Typography></Box></Stack>
        <Stack direction="row" alignItems="center" spacing={1}><Box sx={{ textAlign: 'right' }}><Typography fontWeight={850} color="secondary.main">{bytes(g.potential_savings_bytes)}</Typography><Typography variant="caption" color="text.secondary">reclaimable</Typography></Box><IconButton onClick={() => setOpen(open === i ? null : i)}><FaChevronDown size={15} style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: '.2s' }} /></IconButton></Stack>
      </Stack>
      <Collapse in={open === i}><Stack spacing={1} sx={{ mt: 2 }}><Box sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: 'rgba(33,212,179,.05)' }}><Typography variant="caption" color="text.secondary">The earliest file is treated as the original. Review before deleting copies.</Typography></Box>{g.files.map(f => <Stack key={f.file_id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.6, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.04)' }}><Stack direction="row" spacing={1.3} alignItems="center" minWidth={0}><Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: f.is_original ? 'rgba(33,212,179,.12)' : 'rgba(124,108,255,.10)', color: f.is_original ? '#49e4c8' : '#9b91ff', display: 'grid', placeItems: 'center' }}><FaShieldAlt size={13} /></Box><Box minWidth={0}><Typography fontWeight={700} noWrap>{f.filename}</Typography><Typography variant="caption" color="text.secondary">{date(f.uploaded_at)}</Typography></Box></Stack><Stack direction="row" spacing={1.5} alignItems="center"><Typography fontWeight={700}>{bytes(f.size_bytes)}</Typography>{f.is_original && <Chip label="Original" size="small" color="success" variant="outlined" />}</Stack></Stack>)}</Stack></Collapse>
    </CardContent></Card>) : <EmptyState title="No duplicates found" text="Upload the same content twice to see a group here." />}
  </Stack>;
}
