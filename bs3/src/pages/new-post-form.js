import { 
    FormControlLabel, 
    Paper, 
    Radio,
    RadioGroup,
    TextField,
    Stack,
    FormHelperText,
} from "@mui/material";
import MainActionFab from "../components/main-action-buttons";


export default function PostForm() {
    return (
        <Paper sx={{ m: 2, p: 2}}>
            <Stack direction="column" spacing={2}>
                <Stack direction="column">
                <FormHelperText label="Type">Type</FormHelperText>
                    <RadioGroup row label="Type">
                        <FormControlLabel value="event" control={<Radio />} label="Event" />
                        <FormControlLabel value="discussion" control={<Radio />} label="Discussion" />
                        <FormControlLabel value="sale" control={<Radio />} label="Sale" />
                    </RadioGroup>
                </Stack>
                <TextField label="Author" />
                <TextField label="Title" />
                <TextField label="Body" multiline />
            </Stack>
            <MainActionFab type="submit"/>
        </Paper>
    )
}