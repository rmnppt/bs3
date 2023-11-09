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
import { useOutletContext, useNavigate } from "react-router-dom";

export default function PostForm() {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({tag: "DISCUSSION"});
    const [posts, setPosts] = useOutletContext();

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
        let maxId = 0;
        let ids = posts.map((p) => p.id);
        maxId = Math.max(...ids);
        const newPost = {...formValues, ...{ 
            id: (maxId + 1).toString(),
            upVotes: 0,
            downVotes:0 
        }}
        console.log(newPost);
        setPosts([...posts, newPost]);
        console.log("Post Submitted:");
        navigate("/");
    }
    
    return (
        <Paper sx={{ m: 2, p: 2}}>
            <form>
                <FormGroup>
                    <Stack direction="column" spacing={2}>
                        <Stack direction="column">
                        <FormHelperText label="Type">Type</FormHelperText>
                            <RadioGroup row 
                                name="selectedTag" 
                                label="Tag" 
                                onChange={handleRadioGroupChange}
                                defaultValue="DISCUSSION">
                                <FormControlLabel name="tag" value="DISCUSSION" control={<Radio />} label="Discussion" />
                                <FormControlLabel name="tag" value="EVENT" control={<Radio />} label="Event" />
                                <FormControlLabel name="tag" value="SALE" control={<Radio />} label="Sale" />
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