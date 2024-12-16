import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Project } from "../types";
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

const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [edit, setEdit] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${Config.endpoint}/project/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProject(response.data.project);
        setTitle(response.data.project.title);
        setDescription(response.data.project.description);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to fetch project details",
          variant: "destructive",
        });
      }
    };
    fetchProject();
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${Config.endpoint}/project/${id}`,
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Success",
        description: "Project updated successfully",
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

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center w-[100vw]">
      <div className="container mx-auto p-4 w-[350px]">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              View and update project information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={!edit}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={!edit}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/projects")}>
              Back to Projects
            </Button>
            {edit ? (
              <Button type="submit" onClick={handleSubmit}>
                Update Project
              </Button>
            ) : (
              <Button onClick={() => setEdit(true)}>Edit Project</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;
