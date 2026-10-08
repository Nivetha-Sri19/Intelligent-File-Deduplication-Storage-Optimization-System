import { Stack, Typography } from '@mui/material';
import { FaCloud } from 'react-icons/fa';

interface EmptyStateProps { title?: string; text?: string; }

export default function EmptyState({ title = 'Nothing here yet', text = 'Your workspace will appear here once data is available.' }: EmptyStateProps) {
  return (
    <Stack alignItems="center" spacing={1} sx={{ py: 8, color: 'text.secondary' }}>
      <FaCloud size={52} style={{ opacity: 0.35 }} />
      <Typography variant="h6" color="text.primary">{title}</Typography>
      <Typography textAlign="center">{text}</Typography>
    </Stack>
  );
}
