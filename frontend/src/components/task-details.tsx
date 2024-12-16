import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Task, Project } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Config } from "@/App";
import axios from "axios";

const TaskDetails: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user") || ""));
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [edit, setEdit] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [taskResponse, projectsResponse] = await Promise.all([
          axios.get(`${Config.endpoint}/task/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${Config.endpoint}/project`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setTask(taskResponse.data.task);
        setTitle(taskResponse.data.task.title);
        setDescription(taskResponse.data.task.description);
        setStatus(taskResponse.data.task.status);
        setDeadline(
          new Date(taskResponse.data.task.deadline).toISOString().split("T")[0]
        );
        setProjectId(
          typeof taskResponse.data.task.project === "string"
            ? taskResponse.data.task.project
            : taskResponse.data.task.project._id
        );
        setProjects(projectsResponse.data.projects);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch task details",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${Config.endpoint}/task/${id}`,
        {
          title,
          description,
          status,
          deadline,
          project: projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      setEdit(false);

      navigate("/tasks");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center w-[100vw]">
      <div className="container mx-auto p-4 w-[350px] sm:w-[500px]">
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>View and update task information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={!edit}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Task Description</Label>
                  <Textarea
                    disabled={!edit}
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={setStatus}
                    disabled={!edit}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="To-Do">To-Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    disabled={!edit}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="project">Project</Label>
                  <Select
                    value={projectId}
                    onValueChange={setProjectId}
                    disabled={!edit}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {projects.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="project">Assigned user</Label>
                  <Input id="deadline" type="text" value={user.name} disabled />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/tasks")}>
              Back to Tasks
            </Button>
            {edit ? (
              <Button type="submit" onClick={handleSubmit}>
                Update Task
              </Button>
            ) : (
              <Button onClick={() => setEdit(true)}>Edit</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TaskDetails;
