import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Project } from "../types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Config } from "@/App";
import axios from "axios";
import {
  ArrowBigLeft,
  ArrowLeftCircle,
  ArrowUpLeftFromSquareIcon,
  Backpack,
} from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${Config.endpoint}/project`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="flex justify-center items-center w-[100vw]">
      <div className="container mx-auto p-4 w-[350px]">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2 text-blue-500">
              <ArrowLeftCircle
                className="w-7 h-7 mr-2 cursor-pointer"
                onClick={() => navigate("/")}
              />{" "}
              Go to dashboard
            </div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>All projects you're involved in</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <ul className="space-y-2">
                {projects &&
                  projects.map((project) => (
                    <li key={project._id} className="border-b pb-2">
                      <Link
                        to={`/projects/${project._id}`}
                        className="text-blue-500 hover:underline text-lg"
                      >
                        {project.title}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {project.description}
                      </p>
                    </li>
                  ))}
              </ul>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/projects/new">Create New Project</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Projects;
