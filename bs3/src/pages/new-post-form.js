import { 
    FormControlLabel, 
    Paper, 
    Radio,
    RadioGroup,
    TextField,
    Stack,
    FormHelperText,
    InputAdornment,
    FormGroup
} from "@mui/material";
import MainActionFab from "../components/main-action-buttons";
import AccountCircle from '@mui/icons-material/AccountCircle';
import TitleIcon from '@mui/icons-material/Title';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { useState } from "react";

export default function PostForm() {
    const [formValues, setFormValues] = useState({});

    function handleTextFieldChange(event) {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    }

    function handleRadioGroupChange(event) {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    }

    function handleSubmit() {
        console.log("Post Submitted:");
        console.log(formValues);
    }
    
    return (
        <Paper sx={{ m: 2, p: 2}}>
            <form>
                <FormGroup>
                    <Stack direction="column" spacing={2}>
                        <Stack direction="column">
                        <FormHelperText label="Type">Type</FormHelperText>
                            <RadioGroup row label="Type" onChange={handleRadioGroupChange}>
                                <FormControlLabel name="type" value="event" control={<Radio />} label="Event" />
                                <FormControlLabel name="type" value="discussion" control={<Radio />} label="Discussion" />
                                <FormControlLabel name="type" value="sale" control={<Radio />} label="Sale" />
                            </RadioGroup>
                        </Stack>
                        <TextField name="author" label="Author" onChange={handleTextFieldChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}/>
                        <TextField name="title" label="Title" onChange={handleTextFieldChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TitleIcon />
                                    </InputAdornment>
                                ),
                            }}/>
                        <TextField name="body" label="Body" multiline onChange={handleTextFieldChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TextSnippetIcon />
                                    </InputAdornment>
                                ),
                            }}/>
                    </Stack>
                    <MainActionFab type="submit" clickHandler={handleSubmit}/>
                </FormGroup>
            </form>
        </Paper>
    )
}