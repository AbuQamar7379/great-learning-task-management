import React, { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { Config } from "@/App";
import { AuthContext } from "../context/auth-context";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { login } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginUser();
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(
        `${Config.endpoint}/auth/login`,
        userData
      );

      login(response.data.data, response.data.tokenDetails.token);
      navigate("/");
    } catch (err: any) {
      console.log(err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  return (
    <div className="flex items-center justify-center min-h-screen bg-background w-[100vw]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={userData.email}
                  name="email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={userData.password}
                  name="password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/register")}>
            Register
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
