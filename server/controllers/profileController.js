import { prisma } from "../myPrisma.js";

import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  const user = req.user;

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  });

  res.status(200).json(profile);
};

export const updateProfile = async (req, res) => {
  const user = req.user; // Extract user details from the authenticated request
  const data = req.body; // Extract updated data from the request body

  console.log("Received data for update:", data);

  try {
    // If oldPassword is provided, verify it and update the password if valid
    if (data.oldPassword) {
      const isValidOldPassword = await bcrypt.compare(
        data.oldPassword,
        user.password
      );

      if (!isValidOldPassword) {
        return res.status(400).json({ error: "Invalid old password" });
      }

      if (!data.newPassword) {
        return res.status(400).json({
          error: "New password must be provided when updating the password",
        });
      }

      // Hash the new password and update it
      data.password = await bcrypt.hash(data.newPassword, 10);
    }

    // Remove oldPassword and newPassword from the data object to avoid them being saved accidentally
    delete data.oldPassword;
    delete data.newPassword;

    // If password exists in the data (which should only be the new one), ensure it's hashed
    if (data.password) {
      const bcryptHashRegex = /^\$2[ayb]\$.{56}$/;

      if (!bcryptHashRegex.test(data.password)) {
        data.password = await bcrypt.hash(data.password, 10);
      }
    }

    // Update the user's profile in the database
    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    // Remove the password from the response to avoid sending it back
    // delete updatedProfile.password;

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the profile" });
  }
};
