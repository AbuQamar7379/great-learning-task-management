import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Config } from "@/App";

const NewProject: React.FC = () => {
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post(`${Config.endpoint}/project`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      navigate("/projects");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: any) =>
    setProjectData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  return (
    <div className="flex justify-center items-center w-[100vw]">
      <div className="container mx-auto p-4 w-[350px]">
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>
              Add a new project to your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title"
                    value={projectData.title}
                    name="title"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter project description"
                    value={projectData.description}
                    name="description"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/projects")}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Create Project
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NewProject;
