import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c6cff' },
    secondary: { main: '#21d4b3' },
    background: { default: '#050816', paper: '#0b1122' },
    text: { primary: '#f5f7ff', secondary: '#8e9ab7' },
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 850, letterSpacing: '-0.045em' },
    h2: { fontWeight: 850, letterSpacing: '-0.04em' },
    h3: { fontWeight: 850, letterSpacing: '-0.035em' },
    h4: { fontWeight: 800, letterSpacing: '-0.025em' },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 750 },
  },
  shape: { borderRadius: 20 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#050816',
          backgroundImage: 'radial-gradient(circle at 18% 10%, rgba(124,108,255,.13), transparent 28%), radial-gradient(circle at 84% 8%, rgba(33,212,179,.09), transparent 24%)',
        },
        '*': { scrollbarWidth: 'thin', scrollbarColor: '#26304a transparent' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 750,
          borderRadius: 13,
          minHeight: 42,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7c6cff 0%, #5b48e8 55%, #21d4b3 150%)',
          boxShadow: '0 10px 30px rgba(124,108,255,.28)',
          '&:hover': { boxShadow: '0 14px 36px rgba(124,108,255,.38)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, rgba(15,23,43,.94), rgba(8,14,29,.92))',
          border: '1px solid rgba(150,165,210,.10)',
          boxShadow: '0 22px 70px rgba(0,0,0,.24)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: 'rgba(150,165,210,.08)' },
        head: { color: '#8e9ab7', fontWeight: 700 },
      },
    },
  },
});
