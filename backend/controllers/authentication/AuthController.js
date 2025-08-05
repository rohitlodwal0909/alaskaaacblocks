const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require('../../models');
const {AuthModel, Log}= db


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await AuthModel.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    //  Return Token
    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone : admin?.phone ,
         gender : admin?.gender,
        address : admin?.address,
         role_id:admin?.role_id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
   const userId = req.params.id // Assuming user ID is set by auth middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const admin = await AuthModel.findByPk(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const { name, email, password ,phone ,address, gender, role_id } = req.body;
    const profileImageFile = req.file;
    const profileImagePath = profileImageFile ? `/uploads/${profileImageFile.filename}` : admin.profile_image;
    // Optional: check for duplicate email if updating
    if (email && email !== admin.email) {
      const existing = await AuthModel.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updateData = {
      name: name ?? admin.name,
      email: email ?? admin.email,
      phone : phone ?? admin?.phone ,
      address: address ?? admin?.address,
      gender: gender ?? admin?.gender,
      role_id:role_id??  admin?.role_id,
      profile_image:profileImagePath
    };

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }
    await admin.update(updateData);
    res.status(200).json({
      message: "Profile updated successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
         phone : admin?.phone ,
        address:admin?.address,
         gender:admin?.gender,
        role_id:  admin?.role_id,
        profile_image:admin?.profile_image
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.params.id; // या req.user.id अगर JWT middleware लगा है
    const { new_password, confirm_password } = req.body;
    if (!new_password) {
      return res.status(400).json({ message: "New password is required" });
    }
    // Optional: Check confirm_password if frontend sends it
    if (confirm_password && new_password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const admin = await AuthModel.findByPk(userId);
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await admin.update({ password: hashedPassword });
    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await AuthModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "No user found with this email address" });
    }

    // Send back user data (excluding password)
    res.json({
      message: "User found",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        role_id: user.role_id
      }
    });

    // OPTIONAL: Send reset password link / OTP email here

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const userId = req.params.id;
    const admin = await AuthModel.findByPk(userId, {
      attributes: { exclude: ["password"] }, // Hide password from response
    });

    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ admin });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [['created_at', 'DESC']], // Sort by createdAt descending
    });

    res.status(200).json({
      message: "Logs fetched successfully",
      data: logs
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


