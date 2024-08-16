"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import GoogleSignInButton from "../GoogleSignInButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import axios from "axios";
import { baseurl } from "../../../baseUrl/baseUrl";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

const FormSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    age: z.coerce
      .number()
      // .number()
      // .int()
      .min(18, "You must be at least 18 years old")
      .max(100, "Age must be 100 or below"),
    gender: z.string({
      required_error: "Please select an email to display.",
    }),
    role: z.string({
      required_error: "Please select a role to display.",
    }),
    picture: z.any().optional(),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });
type FormData = z.infer<typeof FormSchema>;

function SignUpForm() {
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "USER",
      // age: "",
      gender: "Male",
      picture: null,
      password: "",
      confirmPassword: "",
    },
  });

  const handleCloudinarySubmit = async (): Promise<string | null> => {
    try {
      const data = new FormData();
      data.append("file", image as Blob);
      data.append("upload_preset", "brq9zntc");
      data.append("cloud_name", "disydeogf");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/disydeogf/image/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Specify the content type as multipart/form-data
          },
        }
      );

      console.log(response);

      // Extract and return the secure URL from the response
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const imageURL = await handleCloudinarySubmit();

    console.log("imageURL", imageURL);
    try {
      const response = await axios.post(`${baseurl}/api/auth/signup`, {
        email: data.email,
        password: data.password,
        name: data.username,
        age: data.age,
        role: data.role,
        gender: data.gender,
        profilePicUrl: imageURL,
        // profilePicUrl: data.picture[0].name,
      });

      console.log("Your record saved successfully!", response.data);

      toast({
        title: "Success",
        description: "Account Created successfully",
      });
    } catch (error) {
      console.error(
        "Error:",
        (error as Error).message || "An unexpected error occurred"
      );
      toast({
        title: "Error",
        description:
          "There was an issue creating your account. Please try again.",
        // status: "error",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Your Age" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Transformer">Transformer</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>
                  {form.formState.errors.gender?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>
                  {form.formState.errors.gender?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter Your password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-Enter your Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Re-Enter your Password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                if (e.target.files) {
                  setImage(e.target.files[0]);
                }
              }}
            />
            {/* <button onClick={handleCloudinarySubmit}>Upload</button> */}
          </div>
          {/* <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="picture">Profile Picture</FormLabel>
                <FormControl>
                  <input
                    id="picture"
                    type="file"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}
        </div>
        <Button className="w-full mt-6" type="submit">
          Sign up
        </Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <GoogleSignInButton>Sign up with Google</GoogleSignInButton>

      <p className="text-center text-sm text-gray-600 mt-2">
        If you have an account, please&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </Form>
  );
}

export default SignUpForm;
