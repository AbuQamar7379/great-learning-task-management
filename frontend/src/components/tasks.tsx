import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Task, User } from "../types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Config } from "@/App";
import axios from "axios";
import { ArrowLeftCircle } from "lucide-react";

interface FilterState {
  status: string;
  deadline: string;
  assignedUser: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  const [filter, setFilter] = useState<FilterState>({
    status: "",
    deadline: "",
    assignedUser: "",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${Config.endpoint}/task`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    return (
      (filter.status === "all" || task.status === filter.status) &&
      (filter.deadline
        ? new Date(task.deadline).toDateString() ===
          new Date(filter.deadline).toDateString()
        : true) &&
      (filter.assignedUser
        ? typeof task.assignedUser === "object"
          ? task.assignedUser._id === filter.assignedUser
          : task.assignedUser === filter.assignedUser
        : true) &&
      (search
        ? task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
        : true)
    );
  });

  return (
    <div className="flex justify-center items-center w-[100vw]">
      <div className="container mx-auto p-4 w-[90%] md:w-[60%]">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2 text-blue-500">
              <ArrowLeftCircle
                className="w-7 h-7 mr-2 cursor-pointer"
                onClick={() => navigate("/")}
              />{" "}
              Go to dashboard
            </div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Manage and filter your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <Input
                type="text"
                placeholder="Search tasks"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow"
              />
              <Select
                value={filter.status}
                onValueChange={(value: any) =>
                  setFilter({ ...filter, status: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="To-Do">To-Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={filter.deadline}
                onChange={(e) =>
                  setFilter({ ...filter, deadline: e.target.value })
                }
              />
            </div>
            <ScrollArea className="h-[400px]">
              <ul className="space-y-2">
                {filteredTasks.length === 0 && (
                  <p className="text-center mt-10 text-muted-foreground">
                    No match found.
                  </p>
                )}
                {filteredTasks.map((task) => (
                  <li
                    key={task._id}
                    className="flex justify-between items-center border-b pb-2"
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
              <Link to="/tasks/new">Create New Task</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Tasks;
