import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Post, { idLoader } from './pages/post-detail';
import ErrorPage from './pages/error-page';
import PostForm from './pages/new-post-form';
import PostList from './pages/post-list';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import { Provider } from 'react-redux';
import { store } from './app/store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <PostList />
      },
      {
        path: 'p/:postId',
        element: <Post />,
        loader: idLoader
      },
      {
        path: 'new',
        element: <PostForm />
      }
    ]
  }
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
}
