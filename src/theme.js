import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#276EF1',
      light: '#5B91F5',
      dark: '#1E54B7',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#05A357',
      light: '#06C167',
      dark: '#05824A',
    },
    error: {
      main: '#E11900',
      light: '#F93415',
      dark: '#B21500',
    },
    warning: {
      main: '#FFC043',
      light: '#FFCF70',
      dark: '#BC8B2C',
    },
    info: {
      main: '#276EF1',
      light: '#5B91F5',
      dark: '#1E54B7',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#545454',
      disabled: '#AFAFAF',
    },
    grey: {
      50: '#F7F7F7',
      100: '#EEEEEE',
      200: '#E2E2E2',
      300: '#CBCBCB',
      400: '#AFAFAF',
      500: '#757575',
      600: '#545454',
      700: '#333333',
      800: '#1F1F1F',
      900: '#141414',
    },
  },
  typography: {
    fontFamily: [
      'UberMove',
      'UberMoveText',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'UberMove, sans-serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'UberMove, sans-serif',
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: 'UberMove, sans-serif',
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: 'UberMove, sans-serif',
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h5: {
      fontFamily: 'UberMove, sans-serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h6: {
      fontFamily: 'UberMove, sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.3,
    },
    subtitle1: {
      fontFamily: 'UberMoveText, sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    subtitle2: {
      fontFamily: 'UberMoveText, sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
    body1: {
      fontFamily: 'UberMoveText, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: 'UberMoveText, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontFamily: 'UberMoveText, sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
      lineHeight: 1.5,
    },
    caption: {
      fontFamily: 'UberMoveText, sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontFamily: 'UberMoveText, sans-serif',
      fontWeight: 500,
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: 1,
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#000000',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        containedSecondary: {
          backgroundColor: '#276EF1',
          '&:hover': {
            backgroundColor: '#1E54B7',
          },
        },
        outlined: {
          borderWidth: 1,
        },
        outlinedPrimary: {
          borderColor: '#000000',
          '&:hover': {
            borderColor: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #E2E2E2',
        },
      },
    },
  },
});

export default theme; 