import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { MdMenu, MdChevronRight } from 'react-icons/lib/md'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const NavMenu = () => {
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  };

  const handleDrawerClose = () => {
    setOpen(false)
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        className='m-navMenu'
        classes={{paper: 'm-navMenu'}}
      >
        <div>
          <IconButton onClick={handleDrawerClose}>
            <MdChevronRight />
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link to='/about'>
            <ListItem button key={'about'} onClick={handleDrawerClose}>
              <ListItemText primary={'About'} />
            </ListItem>
          </Link>
          <Link to='/how-it-works'>
            <ListItem button key={'howItWorks'} onClick={handleDrawerClose}>
              <ListItemText primary={'How it works'} />
            </ListItem>
          </Link> 
          <Link to='/contact'>
            <ListItem button key={'contact'} onClick={handleDrawerClose}>
              <ListItemText primary={'Contact'} />
            </ListItem>
          </Link>                     
          <Link to='/terms'>
            <ListItem button key={'terms'} onClick={handleDrawerClose}>
              <ListItemText primary={'Privacy and Terms of Service'} />
            </ListItem>
          </Link>          
        </List>
      </Drawer>

    <IconButton
      classes={{label:'u-colorWhite'}}
      onClick={handleDrawerOpen}
    >
      <MdMenu />
    </IconButton>
  </>
  )
}

export default withRouter(NavMenu)