import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, CircularProgress, LinearProgress,
  Stack, Typography, IconButton, Chip, Divider,
} from '@mui/material';
import { FaFile, FaDatabase, FaCopy, FaPiggyBank, FaArrowUp, FaCloudUploadAlt, FaCheckCircle, FaArrowRight, FaBolt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { analytics, files } from '../api/services';
import type { Dashboard as D } from '../api/types';
import { bytes, date } from '../utils/format';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';

function Ring({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <Box sx={{ width: 190, height: 190, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `conic-gradient(#21d4b3 ${safe * 3.6}deg, rgba(255,255,255,.07) 0deg)`, position: 'relative', boxShadow: '0 0 70px rgba(33,212,179,.10)' }}>
      <Box sx={{ width: 148, height: 148, borderRadius: '50%', bgcolor: '#0b1325', display: 'grid', placeItems: 'center', textAlign: 'center', border: '1px solid rgba(255,255,255,.06)' }}>
        <Box><Typography variant="h3" fontWeight={900}>{Math.round(safe)}%</Typography><Typography color="secondary.main" fontWeight={750}>Efficient</Typography></Box>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  const [d, setD] = useState<D | null>(null);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);
  const nav = useNavigate();

  const load = () => analytics.dashboard().then(r => setD(r.data)).catch(e => setErr(e.response?.data?.detail || 'Dashboard unavailable'));
  useEffect(() => { load(); }, []);

  const efficiency = useMemo(() => {
    if (!d || d.total_storage_bytes <= 0) return 100;
    return Math.max(0, Math.min(100, 100 - (d.potential_storage_savings_bytes / d.total_storage_bytes) * 100));
  }, [d]);

  const upload = async (file: File) => {
    setUploading(true);
    setErr('');
    try { await files.upload(file); await load(); }
    catch (e: any) { setErr(e.response?.data?.detail || 'Upload failed'); }
    finally { setUploading(false); }
  };

  if (err && !d) return <Alert severity="error">{err}</Alert>;
  if (!d) return <LinearProgress />;

  return (
    <Stack spacing={3}>
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 5, p: { xs: 2.5, md: 4 }, background: 'linear-gradient(125deg, rgba(22,29,57,.92), rgba(9,16,34,.86))', border: '1px solid rgba(124,108,255,.16)' }}>
        <Box className="dedup-orb" sx={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', right: -80, top: -150, background: 'radial-gradient(circle, rgba(124,108,255,.45), rgba(124,108,255,0) 68%)', filter: 'blur(3px)' }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={3} alignItems={{ md: 'center' }}>
            <Box>
              <Typography color="text.secondary" fontWeight={700} sx={{ mb: 1 }}>STORAGE INTELLIGENCE CENTER</Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: 34, md: 46 } }}>Analyze. Find duplicates. <Box component="span" sx={{ background: 'linear-gradient(90deg,#9b91ff,#21d4b3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reclaim space.</Box></Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 650 }}>A live command center for your files, content fingerprints and recovered storage.</Typography>
            </Box>
            <Chip icon={<FaCheckCircle size={14} />} label="System healthy" color="success" variant="outlined" sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, borderRadius: 3, fontWeight: 750 }} />
          </Stack>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4,1fr)' }, gap: 2 }}>
        <StatCard label="Total files" value={d.total_files} icon={<FaFile />} trend="Content indexed" tone="purple" />
        <StatCard label="Storage used" value={bytes(d.total_storage_bytes)} icon={<FaDatabase />} trend="Across your vault" tone="teal" />
        <StatCard label="Duplicate files" value={d.duplicate_files} icon={<FaCopy />} trend="Same content detected" tone="pink" />
        <StatCard label="Potential savings" value={bytes(d.potential_storage_savings_bytes)} icon={<FaPiggyBank />} trend="Reclaimable storage" tone="gold" />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.15fr .9fr .8fr' }, gap: 2 }}>
        <Card className="dedup-hover"><CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography variant="h6">Storage overview</Typography><Typography variant="body2" color="text.secondary">Your current storage footprint</Typography></Box><FaDatabase color="#7c6cff" /></Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-around" sx={{ mt: 3, gap: 3 }}>
            <Box sx={{ width: 175, height: 175, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `conic-gradient(#7c6cff 0 42%, #21d4b3 42% 66%, #ef5bb4 66% 84%, #f4b400 84% 100%)` }}><Box sx={{ width: 125, height: 125, borderRadius: '50%', bgcolor: '#0b1325', display: 'grid', placeItems: 'center', textAlign: 'center' }}><Typography variant="h5" fontWeight={900}>{bytes(d.total_storage_bytes)}</Typography><Typography variant="caption" color="text.secondary">total footprint</Typography></Box></Box>
            <Stack spacing={1.5} sx={{ minWidth: 190 }}>
              {[[ '#7c6cff','Files','Indexed content'],['#21d4b3','Duplicates',`${d.duplicate_files} detected`],['#ef5bb4','Reclaimable',bytes(d.potential_storage_savings_bytes)]].map(([c,l,v]) => <Stack key={l} direction="row" spacing={1.2} alignItems="center"><Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: c }} /><Box><Typography variant="body2" fontWeight={700}>{l}</Typography><Typography variant="caption" color="text.secondary">{v}</Typography></Box></Stack>)}
            </Stack>
          </Stack>
        </CardContent></Card>

        <Card className="dedup-hover"><CardContent sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6">Storage efficiency</Typography><Typography variant="body2" color="text.secondary">Based on reclaimable duplicate storage</Typography>
          <Stack alignItems="center" spacing={2} sx={{ mt: 2 }}><Ring value={efficiency} /><Stack spacing={1} sx={{ width: '100%' }}>{['Duplicate detection active','SHA-256 analysis enabled','Safe deletion available'].map(x => <Stack key={x} direction="row" spacing={1} alignItems="center"><FaCheckCircle color="#21d4b3" size={14} /><Typography variant="body2" color="text.secondary">{x}</Typography></Stack>)}</Stack></Stack>
        </CardContent></Card>

        <Card className="dedup-hover"><CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6">Recent activity</Typography><Button size="small" endIcon={<FaArrowRight size={11} />} onClick={() => nav('/files')}>View all</Button></Stack>
          <Stack spacing={2} sx={{ mt: 2.5 }}>{d.recent_uploads?.length ? d.recent_uploads.slice(0, 5).map((f: any, i: number) => <Stack key={i} direction="row" spacing={1.4} alignItems="flex-start"><Box sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: i === 0 ? 'rgba(124,108,255,.18)' : 'rgba(33,212,179,.12)', color: i === 0 ? '#9b91ff' : '#49e4c8', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{i === 0 ? <FaCloudUploadAlt size={13} /> : <FaCheckCircle size={13} />}</Box><Box sx={{ minWidth: 0 }}><Typography variant="body2" fontWeight={700} noWrap>{f.original_filename || f.filename || 'File uploaded'}</Typography><Typography variant="caption" color="text.secondary">{date(f.uploaded_at)}</Typography></Box></Stack>) : <EmptyState title="No activity yet" text="Upload a file to start the intelligence engine." />}</Stack>
        </CardContent></Card>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.1fr .9fr' }, gap: 2 }}>
        <Card className="dedup-hover"><CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography variant="h6">Duplicate radar</Typography><Typography variant="body2" color="text.secondary">Groups with the highest reclaim potential</Typography></Box><Button size="small" onClick={() => nav('/duplicates')}>View all</Button></Stack>
          <Stack spacing={1.2} sx={{ mt: 2.5 }}>{d.duplicate_files > 0 ? <><Stack direction="row" justifyContent="space-between" sx={{ p: 1.7, borderRadius: 3, bgcolor: 'rgba(239,91,180,.06)', border: '1px solid rgba(239,91,180,.10)' }}><Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ width: 38, height: 38, borderRadius: 2.5, bgcolor: 'rgba(239,91,180,.14)', color: '#ff79c8', display: 'grid', placeItems: 'center' }}><FaCopy /></Box><Box><Typography fontWeight={750}>{d.duplicate_files} duplicate files detected</Typography><Typography variant="caption" color="text.secondary">Potential savings: {bytes(d.potential_storage_savings_bytes)}</Typography></Box></Stack><IconButton onClick={() => nav('/duplicates')}><FaArrowRight size={13} /></IconButton></Stack><Typography variant="caption" color="text.secondary">Open Duplicate Radar to inspect each SHA-256 group and identify the original file.</Typography></> : <EmptyState title="No duplicates found" text="Upload the same content twice to create a duplicate group." />}</Stack>
        </CardContent></Card>

        <Card className="dedup-hover"><CardContent sx={{ p: 3 }}>
          <Typography variant="h6">Quick upload</Typography><Typography variant="body2" color="text.secondary">Drop a file into your vault and hashing starts in the background.</Typography>
          <Box component="label" sx={{ mt: 2.5, minHeight: 190, borderRadius: 4, border: '1px dashed rgba(124,108,255,.45)', bgcolor: 'rgba(124,108,255,.05)', display: 'grid', placeItems: 'center', textAlign: 'center', cursor: uploading ? 'wait' : 'pointer', transition: '.2s', '&:hover': { bgcolor: 'rgba(124,108,255,.09)', borderColor: 'rgba(124,108,255,.75)' } }}>
            <input hidden type="file" disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.currentTarget.value = ''; }} />
            <Stack alignItems="center" spacing={1.3}><Box className="dedup-pulse" sx={{ width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'rgba(124,108,255,.14)', color: '#9b91ff' }}>{uploading ? <CircularProgress size={22} color="inherit" /> : <FaCloudUploadAlt size={24} />}</Box><Typography fontWeight={800}>{uploading ? 'Analyzing file...' : 'Drop files here to analyze'}</Typography><Typography variant="caption" color="text.secondary">Any file type · SHA-256 fingerprinting · automatic duplicate detection</Typography><Button component="span" variant="contained" startIcon={<FaBolt size={13} />}>{uploading ? 'Processing' : 'Choose file'}</Button></Stack>
          </Box>
        </CardContent></Card>
      </Box>

      <Card className="dedup-hover"><CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography variant="h6">Largest files</Typography><Typography variant="body2" color="text.secondary">The files consuming the most storage</Typography></Box><Button size="small" onClick={() => nav('/files')}>Manage files <FaArrowRight size={10} style={{ marginLeft: 7 }} /></Button></Stack>
        <Stack sx={{ mt: 2 }} divider={<Divider sx={{ borderColor: 'rgba(255,255,255,.06)' }} />}>{d.largest_files?.length ? d.largest_files.slice(0, 5).map((f: any, i: number) => <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.6 }}><Stack direction="row" spacing={1.4} alignItems="center" minWidth={0}><Box sx={{ width: 38, height: 38, borderRadius: 2.5, bgcolor: 'rgba(124,108,255,.10)', color: '#9b91ff', display: 'grid', placeItems: 'center' }}><FaFile size={15} /></Box><Box minWidth={0}><Typography fontWeight={700} noWrap>{f.original_filename || f.filename || 'File'}</Typography><Typography variant="caption" color="text.secondary">{f.mime_type || 'Unknown type'}</Typography></Box></Stack><Typography fontWeight={800}>{bytes(f.size_bytes || 0)}</Typography></Stack>) : <EmptyState title="No files yet" text="Your largest files will appear here." />}</Stack>
      </CardContent></Card>
    </Stack>
  );
}
