import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  Paper,
  TextField,
  Stack,
  FormHelperText,
  InputAdornment,
  FormGroup,
  Modal,
  Box,
  Button,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import TitleIcon from "@mui/icons-material/Title";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { insertPost } from "../app/firestoreSlice";
import MainActionFab from "../components/main-action-buttons";
import SimpleMDEEditor from "react-simplemde-editor";
import { Options } from "easymde";
import "easymde/dist/easymde.min.css";

interface FormValues {
  tag: string;
  author: string;
  title: string;
  body: string;
  upVoted: string[];
  downVoted: string[];
}

const validationSchema = yup.object({
  tag: yup
    .string()
    .matches(/^\S*$/, "Tag must not contain spaces")
    .matches(/^[a-zA-Z0-9]+$/, "Tag must contain only letters and numbers")
    .max(16, "Tag must be 16 characters or less"),
  author: yup.string().default("Anonymous"),
  title: yup
    .string()
    .min(8, "Must be 8 characters long")
    .max(32, "Must be 32 characters or less.")
    .required("Title is required"),
  body: yup
    .string()
    .min(32, "Body must be 32 characters long.")
    .required("Body is required"),
});

export default function PostForm(): JSX.Element {
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const userId = useAppSelector((state) => state.app.user);
  const location = useAppSelector((state) => state.geolocation.location);
  
  const [open, setOpen] = useState<boolean>(!location.local);
  const hasLoadedFromLocalStorage = useRef<boolean>(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      tag: "",
      author: "",
      title: "",
      body: "",
      upVoted: [],
      downVoted: [],
    },
    validationSchema,
    onSubmit: (values: FormValues) => {
      handleSubmit(values);
    },
  });

  function handleSubmit(values: FormValues): void {
    const newPost = {
      ...values,
      userId,
      timestamp: new Date().toISOString(),
    };
    if (!newPost.author) {
      newPost.author = "anonymous";
    }
    const submittedPost = dispatch(insertPost(newPost)) as any;
    navigate("/", { state: { postId: submittedPost.id } });
  }

  function handleClear(): void {
    formik.resetForm();
  }

  const handleClose = (): void => {
    setOpen(false);
    navigate(-1);
  };

  const handleEditorChange = useCallback(
    (value: string) => {
      formik.setFieldValue("body", value);
    },
    [formik]
  );

  const editorOptions: Options = useMemo(
    () => ({
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "preview",
        "side-by-side",
        "fullscreen",
      ],
    }),
    []
  );

  useEffect(() => {
    if (!hasLoadedFromLocalStorage.current) {
      const savedForm = localStorage.getItem("newPostForm");
      if (savedForm) {
        formik.setValues(JSON.parse(savedForm));
      }
      hasLoadedFromLocalStorage.current = true;
    }
  }, [formik]);

  useEffect(() => {
    localStorage.setItem("newPostForm", JSON.stringify(formik.values));
  }, [formik.values]);

  return (
    <>
      {location.local ? (
        <Paper sx={{ m: 2, p: 2 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => navigate(-1)}>Save</Button>
            <Button onClick={handleClear}>Clear</Button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Stack direction="column" spacing={2}>
                <FormHelperText>Details</FormHelperText>
                <TextField
                  id="tag"
                  name="tag"
                  label="Tag"
                  value={formik.values.tag}
                  onChange={formik.handleChange}
                  error={formik.touched.tag && Boolean(formik.errors.tag)}
                  helperText={formik.touched.tag && formik.errors.tag}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">#</InputAdornment>
                    ),
                  }}
                />
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
                  }}
                />
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
                  }}
                />
                <FormHelperText>Body</FormHelperText>
                <div>
                  <SimpleMDEEditor
                    id="body"
                    value={formik.values.body}
                    onChange={handleEditorChange}
                    onBlur={() => formik.setFieldTouched("body", true)}
                    options={editorOptions}
                  />
                  {formik.touched.body && formik.errors.body ? (
                    <FormHelperText error>
                      {formik.errors.body}
                    </FormHelperText>
                  ) : null}
                </div>
              </Stack>
              <MainActionFab type="submit" />
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
          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 1,
              margin: "auto",
              maxWidth: "500px",
              mt: "10%",
              boxShadow: 24,
            }}
          >
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
              Try refreshing the page and allowing access to your devices
              location.
              <br />
              <br />
              I will check your location once. You are free to remain anonymous
              and your location data will never be stored.
            </Typography>
            <Button onClick={handleClose} sx={{ mt: 2 }}>
              OK
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
}