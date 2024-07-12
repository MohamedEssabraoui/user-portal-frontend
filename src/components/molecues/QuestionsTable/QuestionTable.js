import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { changeQuestionStatus, searchQuestionById, QuestionDelete } from "../../../redux/actions/questionAction";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  tableBorder: {
    background: "#e7e7e7",
    padding: "15px",
  },
  tableHeader: {
    background: "#3f51b5",
    color: "white",
  },
}));

const QuestionTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const questionList = useSelector((state) => state.questionDetails.list);

  const [updatedQuestionList, setUpdatedQuestionList] = useState(questionList);

  useEffect(() => {
    setUpdatedQuestionList(questionList);
  }, [questionList]); // Refresh data on questionList changes

  const handleDelete = async (id) => {
    await dispatch(QuestionDelete(id));
    // Update local state to reflect deletion immediately
    setUpdatedQuestionList(updatedQuestionList.filter((question) => question._id !== id));
  };

  const viewQuestion = (id) => {
    dispatch(searchQuestionById(id));
  };

  const onQuestionStatusChange = (event, id, status) => {
    dispatch(changeQuestionStatus({ id, status: !status }));
  };

  return (
    <div className={classes.tableBorder}>
      <TableContainer component={Paper} className={classes.table}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeader}>No.</TableCell>
              <TableCell align="left" className={classes.tableHeader}>
                Question
              </TableCell>
              <TableCell className={classes.tableHeader}>Mark</TableCell>
              <TableCell className={classes.tableHeader}>Status</TableCell>
              <TableCell className={classes.tableHeader}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {updatedQuestionList.map((question, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell onClick={() => viewQuestion(question._id)}>
                  {question.body}
                </TableCell>
                <TableCell onClick={() => viewQuestion(question._id)}>
                  {question.marks}
                </TableCell>
                <TableCell
                  style={{ color: question.status ? "green" : "red" }}
                >
                  {question.status ? "Active" : "Blocked"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={(event) =>
                      onQuestionStatusChange(event, question._id, question.status)
                    }
                    style={{
                      background: question.status ? "#00ff0088" : "#eaf248",
                    }}
                  >
                    {question.status ? "Block" : "Unblock"}
                  </Button>
                  <Button
                    onClick={() => handleDelete(question._id)}
                    style={{ background: "#ff0000aa" }}
                  >
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default QuestionTable;



/* import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { TableBody, TableCell, TableRow, Table, TableHead, TableContainer, Paper, Button } from "@material-ui/core";
import { changeQuestionStatus, searchQuestionById ,QuestionDelete} from "../../../redux/actions/questionAction";

const useStyles = (theme)=> ({
  tableBorder:{
    background:'#e7e7e7',
    padding:'15px'
  },
  tableHeader:{
    background:'#3f51b5',
    color:'white'
  }
})



class QuestionTable extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  handleDelete(event,id) {
    this.props.QuestionDelete(id);
  }

  viewQuestion = (id) => {
    this.props.searchQuestionById(id);
  }

  onQuestionStatusChange = (event,id,status) => {
    this.props.changeQuestionStatus({id,status:(!status)});
  }

  render() {
    
    return(
      <div className={this.props.classes.tableBorder}>
      <TableContainer component={Paper} className={this.props.classes.table}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead >
            <TableRow>
              <TableCell className={this.props.classes.tableHeader}>No.</TableCell>
              <TableCell align="left" className={this.props.classes.tableHeader}>Question</TableCell>
              <TableCell className={this.props.classes.tableHeader}>Status</TableCell>
              <TableCell className={this.props.classes.tableHeader}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.questionlist.map((question,index)=>(
              <TableRow key={index}>
                <TableCell>{index+1}</TableCell>
                <TableCell onClick={(event)=>(this.viewQuestion(question._id))}>{question.body}</TableCell>
                <TableCell 
                  style={(question.status===true)?{color:'green'}:{color:'red'}}
                >
                  {(question.status===true)?'Active':'Blocked'}
                </TableCell>
                <TableCell> 
                  <Button 
                    onClick={(event)=>(this.onQuestionStatusChange(event,question._id,question.status))}
                    style={(question.status===false)?{background:'#00ff0088'}:{background:'#eaf248'}}
                  >
                      {(question.status===true)?'block':'unblock'}
                  </Button> 
                  <Button 
                    onClick={(event)=>(this.handleDelete(event,question._id))}
                    style={{background:'#ff0000aa'}}
                  >
                      DELETE
                  </Button> 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </TableContainer>
      </div>
    )
  }
}

const mapStatetoProps = state => ({
  questionlist : state.questionDetails.list
})

export default withStyles(useStyles)(connect(mapStatetoProps,{
  changeQuestionStatus,
  searchQuestionById,
  QuestionDelete
})(QuestionTable)); */