import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../context/auth-context";
import { Project, Task } from "../types";
import { Config } from "@/App";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState({
    name: "",
  });
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { logout } = authContext;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const [projectsResponse, tasksResponse] = await Promise.all([
          axios.get(`${Config.endpoint}/project`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${Config.endpoint}/task`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setProjects(projectsResponse.data.projects);
        setTasks(tasksResponse.data.tasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    const userData = localStorage.getItem("user");
    setUser(JSON.parse(userData!));
  }, []);

  const taskSummary = {
    total: tasks.length,
    completed:
      tasks.length > 0 &&
      tasks.filter((task) => task.status === "Completed").length,
  };

  return (
    <div className="flex items-center w-[100vw]">
      <div className="container mx-auto p-4 w-[90%] md:w-[50%]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={`https://avatar.vercel.sh/${user.name}.png`}
                alt={user.name || ""}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Summary</CardTitle>
              <CardDescription>Overview of your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Total Tasks: {taskSummary.total}</p>
              <p>Completed Tasks: {taskSummary.completed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
              <CardDescription>
                Recent projects you're working on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <ul className="space-y-2">
                  {projects.length > 0 &&
                    projects.map((project) => (
                      <li key={project._id}>
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {project.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/projects">See Projects</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>Recent tasks assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <ul className="space-y-2">
                {tasks.length > 0 &&
                  tasks.map((task) => (
                    <li
                      key={task._id}
                      className="flex justify-between items-center"
                    >
                      <Link
                        to={`/tasks/${task._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {task.title}
                      </Link>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.status === "Completed"
                            ? "bg-green-200 text-green-800"
                            : task.status === "In Progress"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </li>
                  ))}
              </ul>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/tasks">See Tasks</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
