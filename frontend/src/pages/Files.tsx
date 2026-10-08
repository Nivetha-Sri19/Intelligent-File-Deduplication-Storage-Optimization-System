import { useEffect, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import {
  FaUpload,
  FaDownload,
  FaTrash,
  FaSyncAlt,
} from 'react-icons/fa';

import { files } from '../api/services';

import type {
  DeletionPreview,
  FileItem,
} from '../api/types';

import {
  bytes,
  date,
} from '../utils/format';

import EmptyState from '../components/EmptyState';

export default function Files() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const [preview, setPreview] =
    useState<DeletionPreview | null>(null);

  const [deleteId, setDeleteId] = useState('');

  const load = () => {
    setLoading(true);

    files
      .list({
        page: 1,
        page_size: 100,
        search: search || undefined,
        status: status || undefined,
        sort_by: 'uploaded_at',
        sort_order: 'desc',
      })
      .then((r) => {
        setItems(r.data.items);
      })
      .catch((e) => {
        setErr(
          e.response?.data?.detail ||
            'Could not load files'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, [search, status]);

  const upload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setErr('');

    try {
      await files.upload(file);
      load();
    } catch (e: any) {
      setErr(
        e.response?.data?.detail ||
          'Upload failed'
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const download = async (
    id: string,
    name: string
  ) => {
    try {
      const response = await files.download(id);

      const url = URL.createObjectURL(
        response.data
      );

      const anchor =
        document.createElement('a');

      anchor.href = url;
      anchor.download = name;
      anchor.click();

      URL.revokeObjectURL(url);
    } catch (e: any) {
      setErr(
        e.response?.data?.detail ||
          'Download failed'
      );
    }
  };

  const askDelete = async (
    id: string
  ) => {
    try {
      const response =
        await files.removePreview(id);

      setPreview(response.data);
      setDeleteId(id);
    } catch (e: any) {
      setErr(
        e.response?.data?.detail ||
          'Preview failed'
      );
    }
  };

  const confirm = async () => {
    if (!deleteId) {
      return;
    }

    try {
      await files.remove(deleteId);

      setPreview(null);
      setDeleteId('');
      load();
    } catch (e: any) {
      setErr(
        e.response?.data?.detail ||
          'Delete failed'
      );
    }
  };

  return (
    <Stack spacing={3}>
      {/* Page Header */}
      <Box>
        <Typography variant="h3">
          Your files
        </Typography>

        <Typography color="text.secondary">
          Upload once. Deduply fingerprints content
          in the background.
        </Typography>
      </Box>

      {/* Error */}
      {err && (
        <Alert
          severity="error"
          onClose={() => setErr('')}
        >
          {err}
        </Alert>
      )}

      {/* Controls */}
      <Card>
        <CardContent>
          <Stack
            direction={{
              xs: 'column',
              md: 'row',
            }}
            spacing={2}
            justifyContent="space-between"
          >
            {/* Search + Filter */}
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={1.5}
              flex={1}
            >
              <TextField
                placeholder="Search files…"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                sx={{
                  maxWidth: 360,
                }}
              />

              <Select
                value={status}
                displayEmpty
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                sx={{
                  minWidth: 150,
                }}
              >
                <MenuItem value="">
                  All statuses
                </MenuItem>

                <MenuItem value="ready">
                  Ready
                </MenuItem>

                <MenuItem value="processing">
                  Processing
                </MenuItem>

                <MenuItem value="pending">
                  Pending
                </MenuItem>

                <MenuItem value="failed">
                  Failed
                </MenuItem>
              </Select>
            </Stack>

            {/* Actions */}
            <Stack
              direction="row"
              spacing={1}
            >
              <IconButton
                onClick={load}
                title="Refresh"
              >
                <FaSyncAlt size={16} />
              </IconButton>

              <Button
                component="label"
                variant="contained"
                startIcon={
                  <FaUpload size={15} />
                }
                disabled={uploading}
              >
                {uploading
                  ? 'Uploading…'
                  : 'Upload file'}

                <input
                  hidden
                  type="file"
                  onChange={upload}
                />
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading ? (
        <LinearProgress />
      ) : (
        <Card>
          <CardContent
            sx={{
              p: 0,
              '&:last-child': {
                pb: 0,
              },
            }}
          >
            {items.length ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      File
                    </TableCell>

                    <TableCell>
                      Status
                    </TableCell>

                    <TableCell>
                      Size
                    </TableCell>

                    <TableCell>
                      Uploaded
                    </TableCell>

                    <TableCell align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((file) => (
                    <TableRow
                      key={file.id}
                      hover
                    >
                      {/* File */}
                      <TableCell>
                        <Typography
                          fontWeight={700}
                        >
                          {
                            file.original_filename
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {file.extension ||
                            file.mime_type}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          size="small"
                          label={file.status}
                          color={
                            file.status ===
                            'ready'
                              ? 'success'
                              : file.status ===
                                'failed'
                              ? 'error'
                              : 'default'
                          }
                        />
                      </TableCell>

                      {/* Size */}
                      <TableCell>
                        {bytes(
                          file.size_bytes
                        )}
                      </TableCell>

                      {/* Uploaded */}
                      <TableCell>
                        {date(
                          file.uploaded_at
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        <IconButton
                          disabled={
                            file.status !==
                            'ready'
                          }
                          onClick={() =>
                            download(
                              file.id,
                              file.original_filename
                            )
                          }
                          title="Download"
                        >
                          <FaDownload
                            size={16}
                          />
                        </IconButton>

                        <IconButton
                          disabled={
                            file.status ===
                            'deleted'
                          }
                          onClick={() =>
                            askDelete(
                              file.id
                            )
                          }
                          title="Delete"
                        >
                          <FaTrash
                            size={16}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                title="Your vault is empty"
                text="Upload a file to start intelligent deduplication."
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Safe Deletion Dialog */}
      <Dialog
        open={!!preview}
        onClose={() =>
          setPreview(null)
        }
      >
        <DialogTitle>
          Safe deletion preview
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={1.5}
            sx={{
              minWidth: 320,
              pt: 1,
            }}
          >
            <Typography>
              {preview?.filename}
            </Typography>

            <Typography color="text.secondary">
              File size:{' '}
              {bytes(
                preview?.size_bytes || 0
              )}
            </Typography>

            <Typography color="text.secondary">
              Potential storage impact:{' '}
              {bytes(
                preview?.potential_storage_savings_bytes ||
                  0
              )}
            </Typography>

            {preview?.protected && (
              <Alert severity="warning">
                This file is protected and
                cannot be deleted.
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setPreview(null)
            }
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            disabled={preview?.protected}
            onClick={confirm}
          >
            Delete safely
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}