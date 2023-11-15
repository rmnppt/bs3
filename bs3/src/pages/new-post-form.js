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
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux'
import { addPost } from '../app/appSlice'

const validationSchema = yup.object({
    author: yup
        .string("Enter your name")
        .default("Anonymous"),
    title: yup
        .string('Enter a title')
        .min(8, 'Must be 8 characters long')
        .max(50, "Must be shorter than 32 characters long")
        .required('Title is required'),
    body: yup
        .string('Enter your post')
        .min(32, 'Must be 32 characters long')
        .required('Body is required'),
  });

export default function PostForm() {
    const navigate = useNavigate();
    const posts = useSelector(state => state.app.posts)
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: {
          id: null,
          tag: 'DISCUSSION',
          author: '',
          title: '',
          body: '',
          upVotes: 0,
          downVotes: 0 
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          handleSubmit(values);
        },
      });

    function handleSubmit(values) {
        // TODO: some of this logic can live in in the reducer under the prepare callback 
        let maxId = 0;
        let ids = posts.map((p) => p.id);
        maxId = Math.max(...ids);
        const newPost = {...values, ...{ 
            id: (maxId + 1).toString(),
            upVotes: 0,
            downVotes:0 
        }}
        if (newPost.author === "") {
            newPost.author = "anonymous"
        }
        dispatch(addPost(newPost));
        console.log("Post Submitted:");
        console.log(newPost);
        navigate("/", { state: { postId: newPost.id } });
    }
    
    return (
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
                    <MainActionFab type="submit" />
                </FormGroup>
            </form>
        </Paper>
    )
}