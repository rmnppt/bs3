import { 
    FormControlLabel, 
    Paper, 
    Radio,
    RadioGroup,
    TextField,
    Stack,
    FormHelperText,
    InputAdornment,
    FormGroup,
    Modal,
    Box,
    Button,
    Typography
} from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import TitleIcon from '@mui/icons-material/Title';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { insertPost } from '../app/firestoreSlice'
import MainActionFab from "../components/main-action-buttons";
import { nanoid } from "nanoid";

const validationSchema = yup.object({
    author: yup
        .string("Enter your name")
        .default("Anonymous"),
    title: yup
        .string('Enter a title')
        .min(8, 'Must be 8 characters long')
        .max(32, "Must be shorter than 32 characters long")
        .required('Title is required'),
    body: yup
        .string('Enter your post')
        .min(32, 'Must be 32 characters long')
        .required('Body is required'),
  });

export default function PostForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const location = useSelector(state => state.geolocation.location)
    const [open, setOpen] = useState(!location.local);

    const formik = useFormik({
        initialValues: {
          id: null,
          tag: 'DISCUSSION',
          author: '',
          title: '',
          body: '',
          upVoted: [],
          downVoted: [] 
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          handleSubmit(values);
        },
      });

    function handleSubmit(values) {

        const newPost = {...values, ...{ 
            id: nanoid(10)
        }}
        if (newPost.author === "") {
            newPost.author = "anonymous"
        }
        dispatch(insertPost(newPost));
        console.log("Post Submitted:");
        console.log(newPost);
        navigate("/", { state: { postId: newPost.id } });
    }

    const handleClose = () => {
        setOpen(false);
        navigate(-1); // Navigate to the previous screen
    };
    
    return (
        <>
            { location.local ? (
                <Paper sx={{ m: 2, p: 2}}>
                <form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <Stack direction="column" spacing={2}>
                            <Stack direction="column">
                            <FormHelperText label="Type">Type</FormHelperText>
                                <RadioGroup row 
                                    name="selectedTag" 
                                    label="Tag" 
                                    onChange={formik.handleChange}
                                    defaultValue="DISCUSSION">
                                    <FormControlLabel name="tag" value="DISCUSSION" control={<Radio />} label="Discussion" />
                                    <FormControlLabel name="tag" value="EVENT" control={<Radio />} label="Event" />
                                    <FormControlLabel name="tag" value="SALE" control={<Radio />} label="Sale" />
                                </RadioGroup>
                            </Stack>
                            <TextField 
                                id="author"
                                name="author" 
                                label="Author" 
                                value={formik.values.author} 
                                onChange={formik.handleChange}
                                error={formik.touched.author && Boolean(formik.errors.author)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}/>
                            <TextField 
                                id="title"
                                name="title" 
                                label="Title" 
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TitleIcon />
                                        </InputAdornment>
                                    ),
                                }}/>
                            <TextField 
                                id="body"
                                name="body" 
                                label="Body" 
                                value={formik.values.body}
                                multiline onChange={formik.handleChange}
                                error={formik.touched.body && Boolean(formik.errors.body)}
                                helperText={formik.touched.body && formik.errors.body}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TextSnippetIcon />
                                        </InputAdornment>
                                    ),
                                }}/>
                        </Stack>
                        <MainActionFab type="submit"></MainActionFab>
                    </FormGroup>
                </form>
                </Paper>
            ) : (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Oops
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        You do not seem to be in the local area. You are in guest mode. 
                        <br />
                        <br />
                        You cannot submit a post.
                        <br />
                        <br />
                        Try refreshing the page and allowing access to your devices location. 
                        <br />
                        <br />
                        I will check your location once. You are free to remain anonymous and your location data will never be stored.
                    </Typography>
                    <Button onClick={handleClose} sx={{ mt: 2 }}>
                        OK
                    </Button>
                    </Box>
                </Modal>
            )}
        </>
    )

}