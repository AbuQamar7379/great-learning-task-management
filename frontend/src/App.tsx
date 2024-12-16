import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import PrivateRoute from "./components/private-route";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import Projects from "./components/projects";
import Tasks from "./components/tasks";
import NewProject from "./components/new-project";
import NewTask from "./components/new-task";
import ProjectDetails from "./components/project-details";
import TaskDetails from "./components/task-details";

export const Config = {
  endpoint: "http://localhost:1000/api",
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private routes */}
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route
            path="/projects"
            element={<PrivateRoute element={<Projects />} />}
          />
          <Route
            path="/projects/new"
            element={<PrivateRoute element={<NewProject />} />}
          />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/tasks" element={<PrivateRoute element={<Tasks />} />} />
          <Route
            path="/tasks/new"
            element={<PrivateRoute element={<NewTask />} />}
          />
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
