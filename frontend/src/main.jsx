import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Todo,
  List,
  Group,
  Important,
  Auth,
  List_Todo,
  GroupList,
} from "./pages/index.js";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
useQueryClient;
import {
  SignInForm,
  LoginForm,
  AddTodo,
  AddList,
  AddGroup,
  EditGroup,
  UpdateProfile,
  ChangePassword,
} from "./components/index.js";
import { Toaster } from "./components/ui/sonner.jsx";
import EditTodo from "./components/EditTodo.jsx";

const ProfileRoutes = () => (
  <>
    <Route path="update-profile" element={<UpdateProfile />} />
    <Route path="change-password" element={<ChangePassword />} />
  </>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        path="/sign-in"
        element={
          <Auth>
            <SignInForm />
          </Auth>
        }
      />
      <Route
        path="/login"
        element={
          <Auth>
            <LoginForm />
          </Auth>
        }
      />
      <Route path="" element={<Todo />}>
        <Route path="/todo" element={<AddTodo />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />;
        <Route path="edit-todo/:todo_id" element={<EditTodo />} />
      </Route>
      <Route path="/List" element={<List />}>
        <Route path="add-list/:list_id?" element={<AddList />} />
      </Route>
      <Route path="/group" element={<Group />}>
        <Route path="add-group" element={<AddGroup />} />
        <Route path="edit-group/:group_id" element={<EditGroup />} />
      </Route>
      <Route path="/important" element={<Important />}>
        <Route path="edit-todo/:todo_id" element={<EditTodo />} />
      </Route>
      <Route path="/todo/:id" element={<List_Todo />}>
        <Route path="todo" element={<AddTodo />} />
        <Route path="edit-todo/:todo_id" element={<EditTodo />} />
      </Route>
      <Route path="/group-list/:id" element={<GroupList />}>
        <Route path="edit-list/:list_id?" element={<AddList />} />
      </Route>
    </Route>,
  ),
);

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
);
