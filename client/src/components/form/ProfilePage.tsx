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
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUserData, updateUserProfile } from "@/store/update/slice";
import { useToast } from "../ui/use-toast";
import { redirect } from "next/navigation";
import withAuth from "../withAuth";
import { login } from "@/store/login/loginSlice";

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
    oldPassword: z.string(),
    // .min(1, "Password is required")
    // .min(8, "Password must have than 8 characters"),
    newPassword: z
      .string()
      // .min(1, "Password is required")
      // .min(8, "Password must have than 8 characters")
      .optional()
      .refine(
        (val) => val === undefined || val.length === 0 || val.length >= 8,
        {
          message: "Password must have at least 8 characters or be empty",
        }
      ),
    confirmPassword: z.string().optional(),
    // .min(1, "Password confirmation is required"),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        return data.oldPassword && data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      path: ["newPassword"],
      message:
        "New password and confirmation must match, and old password is required.",
    }
  );

type FormData = z.infer<typeof FormSchema>;

function ProfilePage() {
  const userDataaaaa = useSelector((state: RootState) => state.userLogin.data);
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const { toast } = useToast();

  const dispatch = useDispatch<AppDispatch>();

  const userData = useSelector((state: RootState) => state.user.data);
  const userStatus = useSelector((state: RootState) => state.user.status);
  const [old_Password, setOld_Password] = useState("");
  const [old_picture, setOld_picture] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    dispatch(fetchUserData()); // Fetch user data on component mount
  }, [dispatch]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "USER",
      //   age: "",
      gender: "Male",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isDirty, dirtyFields },
  } = form;

  const { reset } = form;
  useEffect(() => {
    if (userData) {
      reset({
        username: userData.name,
        email: userData.email,
        role: userData.role,
        age: userData.age,
        gender: userData.gender,
        picture: userData.profilePicUrl || null,
        // password: userData.password ? userData.password : " ",
        // confirmPassword: userData.password ? userData.password : " ",
      });
    }
  }, [userData, reset]);

  // console.log("userData", userData);

  useEffect(() => {
    if (userData && userData.password) {
      // If userData exists and has a password, set it
      setOld_Password(userData.password);
    } else {
      // Otherwise, set an empty string
      setOld_Password("");
    }
  }, [userData]);

  useEffect(() => {
    if (userData && userData.profilePicUrl) {
      // If userData exists and has a password, set it
      setOld_picture(userData.profilePicUrl);
    }
  }, [userData]);

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
    let imageURL;
    if (image) {
      imageURL = await handleCloudinarySubmit();

      console.log("imageURL", imageURL);
    }

    // console.log("dataaa", data);
    try {
      let updatedData;
      if (image) {
        updatedData = {
          ...data,
          password: old_Password,
          picture: imageURL,
        };
      } else {
        updatedData = {
          ...data,
          password: old_Password,
          picture: old_picture,
        };
      }

      console.log("updatedData", updatedData);
      const response = await dispatch(
        updateUserProfile({ data: updatedData })
      ).unwrap();
      console.log("Profile updated successfully!", response);
      dispatch(login({ data: response }));
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description:
          "There was an issue updating your profile. Please try again.",
        // status: "error",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <img
          className="w-32 h-32 rounded-full object-cover"
          src={
            userDataaaaa?.profilePicUrl ||
            "data:image/png;base64,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"
          }
          alt="profilePicUrl"
        />
      </div>
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
                          <SelectItem value="Transformer">
                            Transformer
                          </SelectItem>
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
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Old password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter New password"
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
                      placeholder="Re-Enter New Password"
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
          <Button disabled={!isDirty} className="w-full mt-6" type="submit">
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default withAuth(ProfilePage);
