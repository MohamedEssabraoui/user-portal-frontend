import React from 'react';
import AlertBox from '../../atoms/Alertbox/AlertBox';
import StudentRegisterForm from '../../templates/studentRegisterForm/studentRegisterForm';
import { Button } from '@material-ui/core';
import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';
import { Navigate } from 'react-router-dom';
import logoImg from '../../pages/main.png';

const useStyles = (theme) => ({
  logoimg : {
    margin:0,
    padding:0,
    height:50
  },
  addHeight : theme.mixins.toolbar,
  title : {
    flexGrow : 1
  },
  main : {
    textAlign : 'center',
    paddingTop : '5%'
  }
})

class StudentRegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gotoHome: false
    }
  }

  onHomeClick() {
    this.setState({
      ...this.state,
      gotoHome : true
    })
  }

  render() {
    if(this.state.gotoHome) {
      return (<Navigate to='/'/>)
    }
    return(
      <div>
          <AppBar
          elevation={0}
          className={this.props.classes.appbar}
          >
            <Toolbar>
                  <Typography variant='h5' className={this.props.classes.title}>
                  <img src={logoImg} alt="Logo" className={this.props.classes.logoimg}/>
                  </Typography>
                  <Typography variant='h6'>
                    <Button variant="contained" className={this.props.classes.endtestbtn} onClick={()=>(this.onHomeClick())}>Home</Button>
                  </Typography>
            </Toolbar>
          </AppBar>
          <div className={this.props.classes.addHeight}></div>
          <div className={this.props.classes.main}>
          <AlertBox/>
          <StudentRegisterForm/>
          </div>
        </div>
    )
  }
}


export default withStyles(useStyles)(StudentRegisterPage);

