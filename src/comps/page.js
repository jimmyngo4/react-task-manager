//imports
    //react
    import React, { Component } from "react";
    //materials
        import Table from '@mui/material/Table';
        import TableBody from '@mui/material/TableBody';
        import TableCell from '@mui/material/TableCell';
        import TableContainer from '@mui/material/TableContainer';
        import TableHead from '@mui/material/TableHead';
        import TableRow from '@mui/material/TableRow';
        import Button from '@mui/material/Button';
        import DiaWrap from '@mui/material/Dialog';
        import Card from '@mui/material/Card';
        import CardHeader from '@mui/material/CardHeader';
        import CardContent from '@mui/material/CardContent';
        import Checkbox from '@mui/material/Checkbox';
        import Stack from '@mui/material/Stack';
    //components
        import Dialog from './dialog';
    //javascript
        import moment from 'moment';
        import toastr from 'toastr';

//master export
    export default class page extends Component {
    //constructor
        constructor(props) {
            super(props);
            this.state = {
                task: {
                    deadline: moment().format('MM/DD/YY'),
                // represents whether the task has been completed or not 
                    isComplete: false,
                // used to tell the child (dialog.js) if the add button or update button was clicked
                // will be set to false when the update button is clicked
                    flag: true
                },
                rows: [],
                open: false,
            // represents which row the 'update' button was clicked on
                buttonToUpdate: 0
            };
        }

    // toggle checkbox completion
        toggleIsComplete(e) {
        // updating the checkbox for row e
            let rows = [...this.state.rows];
            let row = {...rows[e]};
            row.isComplete = !row.isComplete;
            rows[e] = row;
            this.setState({rows});
        }

    //add task
        addTask(){
            this.setState({open: true});
        // updates the flag which is nested in this.state.task
            var task = {...this.state.task}
            task.flag = true;
            this.setState({task})
        };

    //update task
        updateTask(e){
            this.setState({open: true});
            this.setState({buttonToUpdate: e.target.value});
        // updates the flag which is nested in this.state.task
            var task = {...this.state.task}
            task.flag = false;
            this.setState({task})
        };

    //delete task
        deleteTask(e){
            this.setState( prevState => ({
                rows: prevState.rows.filter((_, i) => i !== e.target.value)
            }));
        };

   //callback from dialog input
        dialogCallback = (data) => {//functional syntax intentional
            if(data.action === `submit`){//submitted
                toastr.success(`Task added successfully!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
                this.setState({open: false});
            // appending data.task (which is a const that has title, description, deadline, priority) into rows which is an array and a state
                this.setState({
                    rows: [...this.state.rows, data.task] 
                });
            }
            else if(data.action === `cancel`){//cancelled
                this.setState({open: false});
            }
            else if(data.action === `edit`){//edited
                toastr.success(`Task edited successfully!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
            // updating the values of the row that was edited
                let rows = [...this.state.rows];
                let row = {...rows[this.state.buttonToUpdate]};
                row.description = data.description;
                row.deadline = data.deadline;
                row.priority = data.priority;
                rows[this.state.buttonToUpdate] = row;
                this.setState({rows});
                this.setState({open: false});
            }               
        }

    //render
        render() {
            return (
                <>
                <DiaWrap
                    open={this.state.open}
                    onClose={() => this.dialogCallback()}>
                    <Dialog 
                        parentCallback = {this.dialogCallback}
                        dataFromParent = {this.state.task} >
                    </Dialog>
                </DiaWrap>
                {/*master card*/}
                    <Card sx = {{ margin: '20px' }}>
                    {/*card header*/}
                        <CardHeader sx = {{ bgcolor: 'primary.dark', color: 'white'}} 
                            title = {<><small><i className='fa fa-fw fa-bars'></i>FRAMEWORKS</small></>}
                            style = {{textAlign: 'center'}}
                            action = {
                                <>
                                {/*button*/}
                                    <Button variant = "contained" onClick = {() => this.addTask()} sx = {{width: 100, marginRight: '7px'}}>
                                        <i className = "fa fa-fw fa-plus-circle"></i>Add
                                    </Button>
                                </>
                            }/>
                     {/*card content*/}
                        <CardContent sx = {{ bgcolor: 'white', marginBottom: -1 }}>
                            <TableContainer>
                                <Table sx = {{ bgcolor: 'white' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx = {{ width: 0.1, color: 'gray'}}>Title</TableCell>
                                            <TableCell align="center" sx = {{ width: 0.1, color: 'gray'}}>Description</TableCell>
                                            <TableCell align="center" sx = {{ width: 0.1, color: 'gray'}}>Deadline</TableCell>
                                            <TableCell align="center" sx = {{ width: 0.1, color: 'gray'}}>Priority</TableCell>
                                            <TableCell align="center" sx = {{ width: 0.1, color: 'gray'}}>Is Complete</TableCell>
                                            <TableCell align="center" sx = {{ width: 0.1, color: 'gray'}}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {this.state.rows.map((row, index) => (
                                        <TableRow key={row.title}>
                                            <TableCell align='center'>{row.title}</TableCell>
                                            <TableCell align="center">{row.description}</TableCell>
                                            <TableCell align="center">{row.deadline}</TableCell>
                                            <TableCell align="center">{row.priority}</TableCell>
                                        {/*checkbox functionality*/}
                                            <TableCell align="center">
                                            {row.isComplete ? 
                                                <div><Checkbox defaultChecked onClick={()=> this.toggleIsComplete(index)}/></div> : 
                                                <div><Checkbox onClick={()=> this.toggleIsComplete(index)}/></div> 
                                            }
                                            </TableCell>
                                        {/*update and delete buttons which are stacked using Stack*/}
                                            <TableCell align="center">
                                                <Stack alignItems = "center">
                                                    {row.isComplete ?
                                                        "" :
                                                        <Button variant = "contained" value = {index} onClick = {e => this.updateTask(e)} sx = {{width: 100}}>
                                                            <i className = "fa fa-fw fa-edit"></i>&nbsp;Update
                                                        </Button>
                                                    }
                                                    <Button variant = "contained" value = {index} color = 'error' onClick = {e => this.deleteTask(e)} sx = {{width: 100}}>
                                                        <i className = "fa fa-fw fa-times-circle"></i>&nbsp;Delete
                                                    </Button>
                                                </Stack>
                                            </TableCell>    
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </>
            );
        }
    }      