import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Post, { idLoader } from './pages/post-detail.js'
import ErrorPage from "./pages/error-page";
import PostForm from './pages/new-post-form.js';
import PostList from './pages/post-list.js';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <PostList />
      },
      {
        path: "p/:postId",
        element: <Post />,
        loader: idLoader
      },
      {
        path: "new",
        element: <PostForm />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
