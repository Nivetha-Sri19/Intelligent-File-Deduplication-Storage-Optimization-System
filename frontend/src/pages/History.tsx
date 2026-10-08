import { useEffect, useState } from 'react';
import { Alert, Box, Card, CardContent, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button } from '@mui/material';
import { FaTrashAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { deletions } from '../api/services';
import type { DeletionHistory } from '../api/types';
import { bytes, date } from '../utils/format';
import EmptyState from '../components/EmptyState';

export default function History() {
  const [rows, setRows] = useState<DeletionHistory[]>([]);
  const [err, setErr] = useState('');
  useEffect(() => { deletions.history().then(r => setRows(r.data)).catch(e => setErr(e.response?.data?.detail || 'Could not load deletion history')); }, []);
  return <Stack spacing={3}>
    <Box sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 4, background: 'linear-gradient(125deg,rgba(33,212,179,.08),rgba(124,108,255,.06))', border: '1px solid rgba(33,212,179,.10)' }}><Typography color="text.secondary" fontWeight={700}>AUDIT TRAIL</Typography><Typography variant="h3" sx={{ mt: .5 }}>Deletion history</Typography><Typography color="text.secondary" sx={{ mt: .8 }}>A transparent record of every safe deletion and the storage it released.</Typography></Box>
    {err && <Alert severity="error">{err}</Alert>}
    <Card><CardContent sx={{ p: { xs: 1, md: 2 } }}>{rows.length ? <Table><TableHead><TableRow><TableCell>File</TableCell><TableCell>Status</TableCell><TableCell>Freed</TableCell><TableCell>Deleted at</TableCell><TableCell>Reason</TableCell></TableRow></TableHead><TableBody>{rows.map(r => <TableRow key={r.id} hover><TableCell><Typography fontWeight={700}>{r.filename}</Typography><Typography variant="caption" color="text.secondary">ID {r.id.slice(0, 8)}…</Typography></TableCell><TableCell><Chip icon={r.status === 'completed' ? <FaCheckCircle size={12} /> : r.status === 'failed' ? <FaTimesCircle size={12} /> : <FaClock size={12} />} label={r.status} size="small" color={r.status === 'completed' ? 'success' : r.status === 'failed' ? 'error' : 'default'} /></TableCell><TableCell>{bytes(r.size_bytes)}</TableCell><TableCell>{date(r.deleted_at || r.created_at)}</TableCell><TableCell>{r.reason || '—'}</TableCell></TableRow>)}</TableBody></Table> : <EmptyState title="No deletions yet" text="Completed safe deletions will appear here." />}</CardContent></Card>
  </Stack>;
}
