export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To-Do" | "In Progress" | "Completed";
  deadline: string;
  assignedUser: string | User;
  project: string | Project;
  createdAt: string;
  updatedAt: string;
}
