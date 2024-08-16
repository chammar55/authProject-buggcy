import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { z } from "zod";
import { baseurl } from "../../../baseUrl/baseUrl";

interface UserState {
  data: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  data: null,
  status: "idle",
  error: null,
};

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseurl}/api/profile`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

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
    password: z.string(),
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

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ data }: { data: z.infer<typeof FormSchema> }) => {
    const response = await axios.put(
      `${baseurl}/api/profile`,
      {
        email: data.email,
        password: data.password,
        oldPassword: data?.oldPassword,
        newPassword: data?.newPassword,
        name: data.username,
        age: data.age,
        role: data.role,
        gender: data.gender,
        profilePicUrl: data.picture[0].name || data.picture,
      },
      { withCredentials: true }
    );
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchUserData actions
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      })
      // Handle updateUserProfile actions
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default userSlice.reducer;
