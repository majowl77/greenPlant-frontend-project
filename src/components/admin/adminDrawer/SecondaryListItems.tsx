import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import HomeIcon from '@mui/icons-material/Home'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits'
import { Link } from 'react-router-dom'

const SecondaryListItems = () => {
  return (
    <div>
      <React.Fragment>
        <ListSubheader
          component="div"
          inset
          sx={{
            bgcolor: '#819d85'
          }}>
          Website Pages
        </ListSubheader>
        <Link to="/">
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home Page" />
          </ListItemButton>
        </Link>
        <Link to="/products">
          <ListItemButton>
            <ListItemIcon>
              <ProductionQuantityLimitsIcon />
            </ListItemIcon>
            <ListItemText primary="Products Page" />
          </ListItemButton>
        </Link>
        <Link to="/login">
          <ListItemButton>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Login Page" />
          </ListItemButton>
        </Link>
        <Link to="/profile">
          <ListItemButton>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="profile Page" />
          </ListItemButton>
        </Link>
      </React.Fragment>
    </div>
  )
}

export default SecondaryListItems
