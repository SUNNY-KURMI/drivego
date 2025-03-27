import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useAuth } from '../contexts/AuthContext';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Book a Driver', path: '/drivers' },
  { name: 'My Bookings', path: '/bookings', requiresAuth: true },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleCloseUserMenu();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const renderMobileDrawer = (
    <Box sx={{ width: '100%', maxWidth: 300, bgcolor: 'background.paper' }} role="presentation">
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
          onClick={() => setMobileOpen(false)}
        >
          DriveGo
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {pages.map((page) => (
          (!page.requiresAuth || (page.requiresAuth && user)) && (
            <ListItem key={page.name} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={page.path}
                selected={isActive(page.path)}
                onClick={() => setMobileOpen(false)}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'grey.100',
                    '&:hover': {
                      bgcolor: 'grey.200',
                    },
                  },
                }}
              >
                <ListItemText primary={page.name} />
              </ListItemButton>
            </ListItem>
          )
        ))}
      </List>
      <Divider />
      <List>
        {user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/profile"
                selected={isActive('/profile')}
                onClick={() => setMobileOpen(false)}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'grey.100',
                    '&:hover': {
                      bgcolor: 'grey.200',
                    },
                  },
                }}
              >
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                onClick={() => setMobileOpen(false)}
                sx={{ py: 1.5 }}
              >
                <ListItemText primary="Sign In" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/register"
                onClick={() => setMobileOpen(false)}
                sx={{
                  py: 1.5,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64 }}>
          {/* Logo - visible on all screens */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              color: 'text.primary',
              textDecoration: 'none',
              display: 'flex',
              fontWeight: 700,
              letterSpacing: -0.5,
              mr: 2,
            }}
          >
            DriveGo
          </Typography>

          {/* Mobile menu toggle */}
          {isMobile && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          {/* Desktop navigation */}
          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  (!page.requiresAuth || (page.requiresAuth && user)) && (
                    <Button
                      key={page.name}
                      component={RouterLink}
                      to={page.path}
                      sx={{
                        my: 2,
                        mx: 1,
                        color: isActive(page.path) ? 'primary.main' : 'text.primary',
                        display: 'block',
                        fontWeight: isActive(page.path) ? 700 : 500,
                        position: 'relative',
                        '&::after': isActive(page.path) ? {
                          content: '""',
                          position: 'absolute',
                          bottom: '10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '20px',
                          height: '2px',
                          backgroundColor: 'primary.main'
                        } : {}
                      }}
                    >
                      {page.name}
                    </Button>
                  )
                ))}
              </Box>

              {/* Auth buttons or user menu */}
              {loading ? (
                <CircularProgress size={24} sx={{ ml: 2 }} />
              ) : user ? (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                      <Avatar 
                        alt={user.email || "User"} 
                        src={user.avatar_url || ""} 
                        sx={{ 
                          bgcolor: 'primary.main',
                          width: 36,
                          height: 36
                        }}
                      >
                        {!user.avatar_url && (
                          <PersonOutlineIcon fontSize="small" />
                        )}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem 
                      onClick={() => {
                        navigate('/profile');
                        handleCloseUserMenu();
                      }}
                    >
                      <ListItemText primary="Profile" />
                    </MenuItem>
                    <MenuItem 
                      onClick={() => {
                        navigate('/bookings');
                        handleCloseUserMenu();
                      }}
                    >
                      <ListItemText primary="My Bookings" />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleSignOut}>
                      <ListItemText primary="Sign Out" />
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{ 
                      color: 'text.primary',
                      mr: 2,
                      fontWeight: 500,
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{ 
                      px: 3,
                      py: 1,
                      fontWeight: 500,
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '80%', maxWidth: 300 },
        }}
      >
        {renderMobileDrawer}
      </Drawer>
    </AppBar>
  );
}

export default Header; 