import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { Brightness4, Brightness7, Sync, Menu } from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import { useThemeMode } from '../hooks/useThemeMode'
import type { User } from '../api/interfaces'
import { hasRole } from '../utils/role_utils'

const generateNavItems = (user: User) => {
  const navItems = [{ label: 'Dashboard', path: '/' }]

  if (hasRole(user, 'ReadAsset'))
    navItems.push({ label: 'Assets', path: '/assets' })
  if (hasRole(user, 'ReadUser'))
    navItems.push({ label: 'Users', path: '/users' })
  if (hasRole(user, 'CheckInOutAsset') || hasRole(user, 'RequestAsset'))
    navItems.push({ label: 'Requests', path: '/requests' })

  navItems.push({ label: 'Assignments', path: '/assignments' })

  return navItems
}

const Layout = () => {
  const { user, logout } = useAuth()
  const { mode, toggleTheme } = useThemeMode()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const navItems = generateNavItems(user!)

  const toggleDrawer = () => setOpen(!open)

  const drawerList = (
    <Box width={250}>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            to={item.path}
            onClick={toggleDrawer}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <ListItemButton
          color="inherit"
          onClick={() => {
            logout().then(() => navigate('/login'))
          }}
        >
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  )

  const icon =
    mode === 'light' ? (
      <Brightness4 />
    ) : mode === 'dark' ? (
      <Brightness7 />
    ) : (
      <Sync />
    )
  const label = mode.charAt(0).toUpperCase() + mode.slice(1)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" flexGrow={1}>
            Asset Manager
          </Typography>
          <Box display={{ xs: 'none', md: 'flex' }} gap={2} alignItems="center">
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                component={Link}
                to={item.path}
                disabled={location.pathname === item.path}
              >
                {item.label}
              </Button>
            ))}
            <Tooltip title={`Theme: ${label}`}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {icon}
              </IconButton>
            </Tooltip>
            <Button
              color="inherit"
              onClick={() => {
                logout().then(() => navigate('/login'))
              }}
            >
              Logout
            </Button>
          </Box>
          <Box display={{ xs: 'flex', md: 'none' }} gap={2} alignItems="center">
            <IconButton color="inherit" onClick={toggleDrawer}>
              <Menu />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        {drawerList}
      </Drawer>

      <Box p={3}>
        <Outlet />
      </Box>
    </>
  )
}

export default Layout
