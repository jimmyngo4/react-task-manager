//imports
    //react
    import React from 'react';
    //materials
        import Button from '@mui/material/Button';
        import DialogActions from '@mui/material/DialogActions';
        import DialogContent from '@mui/material/DialogContent';
        import DialogTitle from '@mui/material/DialogTitle';
        import Radio from '@mui/material/Radio';
        import RadioGroup from '@mui/material/RadioGroup';
        import FormControlLabel from '@mui/material/FormControlLabel';
        import FormControl from '@mui/material/FormControl';
        import FormLabel from '@mui/material/FormLabel';
        import TextField from '@mui/material/TextField';
    //components
        import DateTime from './dateTime';
    //javascript
        import toastr from 'toastr';
        import moment from 'moment';

//master export
    export default function ResponsiveDialog(props) {
    //variables
        let [deadline] = React.useState(props.dataFromParent.deadline);
        const [title, setTitle] = React.useState("");
        const [description, setDescription] = React.useState("");
        const [date, setDate] = React.useState(props.dataFromParent.deadline);
        const [priority, setPriority] = React.useState("low");
        const [flag, setFlag] = React.useState(props.dataFromParent.flag);

    // creates constant that has all info for a task
        const rowTask = (title, description, deadline, priority) => { return { title: title, description: description, deadline: date, priority: priority } }

    // add
        let add = () => {
            if (title === "") {
                toastr.error(`Title is Required!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
            }
            else if (description === "") {
                toastr.error(`Description is Required!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
            }
            else {
                const task = rowTask(title, description, date, priority);
                props.parentCallback({
                    action: 'submit',
                    task: task
                })
            }
        };

    // edit
        let edit = () => {
            if (description === "") {
                toastr.error(`Description is Required!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
            }
            else {
                props.parentCallback({
                    action: 'edit',
                    description: description,
                    deadline: date,
                    priority: priority
                })
            }
        }

    //cancel
        let cancel = () => {
            props.parentCallback({
                action: 'cancel',
                data: {}
            });
        };

    // callback from dateTime.js    
        let updateDate = (data) => {
            setDate(moment(data.date).format('MM/DD/YY'));
        }

    //return master object
        return (
            <>       
            {/*title*/}
                {flag ?
                    <DialogTitle sx = {{ bgcolor: 'primary.dark', color: 'white'}}>
                        <i className = "fa fa-fw fa-plus-circle"></i>Add Task
                    </DialogTitle> :
                    <DialogTitle sx = {{ bgcolor: 'primary.dark', color: 'white'}}>
                        <i className = "fa fa-fw fa-edit"></i>Edit Task
                    </DialogTitle>     
                }
            {/*content*/}
                <DialogContent>
                {/*title*/}
                    {flag ?
                        <span>
                        <br /><br />
                        </span> :
                        ""
                    }
                    {flag ?
                        <div>
                            <TextField 
                                id="title"
                                label="Title"
                                onChange={e => setTitle(e.target.value)}
                                error={title === ""}
                                helperText={title === "" ? "Title is Required!" : ""}
                            />
                        </div> :
                        ""
                    }
                {/*description*/}
                    <br /><br />
                    <div>
                        <TextField
                            id="description"
                            label="Description"
                            onChange={e => setDescription(e.target.value)}
                            error={description === ""}
                            helperText={description === "" ? "Description is Required!" : ""}
                        />
                    </div>
                {/*deadline*/}
                    <br /><br />
                    <DateTime dataFromParent = {deadline} parentCallback = {updateDate}/>
                {/*priority*/}
                    <br /><br />
                    <FormControl>
                        <FormLabel id="priority-radio-buttons-group-label">Priority</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="priority-radio-buttons-group-label"
                            defaultValue="low"
                            name="priority-radio-buttons-group"
                            onChange= {e => setPriority(e.target.value)}
                        >
                            <FormControlLabel value="low" control={<Radio />} label="Low" />
                            <FormControlLabel value="med" control={<Radio />} label="Med" />
                            <FormControlLabel value="high" control={<Radio />} label="High" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
            {/*action buttons*/}
                <DialogActions sx={{ bgcolor: 'white'}}>
                    {/*add button and edit button*/}
                    {flag ?
                        <Button onClick = {add} variant = "contained" sx = {{width: 100}}>
                            <i className = "fa fa-fw fa-plus-circle"></i>&nbsp;Add
                        </Button> :
                        <Button onClick = {edit} variant = "contained" sx = {{width: 100}}>
                            <i className = "fa fa-fw fa-edit"></i>&nbsp;Edit
                        </Button>
                    }
                    {/*cancel button*/}
                        <Button onClick = {cancel} variant = "contained" color = 'error' sx = {{bgcolor: '#f44336', width: 100}}>
                            <i className = "fa fa-fw fa-ban"></i>&nbsp;Cancel
                        </Button>
                </DialogActions>
            </>
        );
    }
