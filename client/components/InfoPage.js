import React, {Fragment} from 'react'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import LineGraph from './LineGraph'
import SwipeableViews from 'react-swipeable-views'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import {fade, withStyles, useTheme} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import PropTypes from 'prop-types'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import PhoneIcon from '@material-ui/icons/Phone'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PersonPinIcon from '@material-ui/icons/PersonPin'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

function TabContainer({children, dir}) {
  return (
    <Typography component="div" dir={dir} style={{padding: 8 * 3}}>
      {children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '300px',
    [theme.breakpoints.up('sm')]: {
      '&:focus': {
        width: 300
      }
    }
  },
  tabs: {
    flexGrow: 1
  },
  paperTable: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto'
  },
  tableTable: {
    minWidth: 650
  }
})

class InfoPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      complaints: [],
      address: '',
      tabValue: 0,
      inputAddress: ''
    }
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleChangeIndex = this.handleChangeIndex.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  async componentDidMount() {
    const {data} = await axios.get(
      'https://data.cityofnewyork.us/resource/fhrw-4uyv.json?incident_address=219%20EAST%20196TH%20STREET'
    )
    this.setState({complaints: data})
    console.log(this.state.complaints)
  }
  handleTabChange(event, newValue) {
    this.setState({tabValue: newValue})
  }
  async handleKeyDown(event) {
    if (event.key === 'Enter') {
      try {
        const {data} = await axios.get(
          `https://data.cityofnewyork.us/resource/fhrw-4uyv.json?incident_address=${
            this.state.inputAddress
          }`
        )
        this.setState({complaints: data})
      } catch (err) {
        console.log(err)
      }
    }
  }
  async handleChange(event) {
    await this.setState({inputAddress: event.target.value})
    console.log(this.state)
  }
  handleChangeIndex(index) {
    this.setState({tabValue: index})
  }
  render() {
    const {classes} = this.props
    // const theme = useTheme()

    return (
      <div style={{backgroundColor: 'lightgrey'}}>
        <br />
        <Container>
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                  Graph data for...
                </Typography>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleChange}
                    placeholder="Search for new address"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    inputProps={{'aria-label': 'Search'}}
                    list="colors"
                  />
                </div>
              </Toolbar>
            </AppBar>
          </div>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Complaint Frequency
                  </Typography>
                  <LineGraph />
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Complaints over time
                  </Typography>
                  <LineGraph />
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <br />
          <Paper className={classes.root}>
            <Tabs
              value={this.state.tabValue}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="All Complaints" />
              <Tab label="311 Complaints" />
              <Tab label="User Complaints" />
            </Tabs>

            <SwipeableViews
              axis={classes.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={this.state.tabValue}
              onChangeIndex={this.handleChangeIndex}
            >
              <TabContainer dir={classes.direction}>
                <Paper className={classes.paperTable}>
                  <Table className={classes.tableTable}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Address</TableCell>
                        <TableCell align="center">Complaint Type</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Resolution</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.complaints.map(complaint => {
                        return (
                          // <Paper
                          //   key={complaint.unique_key}
                          //   className={classes.paperTable}
                          // >
                          //   <Table className={classes.tableTable}>
                          //     <TableHead>
                          //       <TableRow>
                          //         <TableCell>Address</TableCell>
                          //         <TableCell align="right">Complaint Type</TableCell>
                          //         <TableCell align="right">Description</TableCell>
                          //         <TableCell align="right">Resolution</TableCell>
                          //       </TableRow>
                          //     </TableHead>
                          <TableRow key={complaint.unique_key}>
                            <TableCell component="th" scope="row">
                              {complaint.incident_address}
                            </TableCell>
                            <TableCell align="center">
                              {complaint.complaint_type}
                            </TableCell>
                            <TableCell align="center">
                              {complaint.descriptor}
                            </TableCell>
                            <TableCell align="center">
                              {complaint.resolution_description}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              </TabContainer>
              <TabContainer dir={classes.direction}>Item Two</TabContainer>
              <TabContainer dir={classes.direction}>Item Three</TabContainer>
            </SwipeableViews>
          </Paper>
        </Container>
        <br />
      </div>
    )
  }
}

InfoPage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(InfoPage)
