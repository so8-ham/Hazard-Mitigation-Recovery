import LocalAdmin from "../models/localadmin.model.js";


// Create Local Admin
export const createLocalAdmin = async (req, res) => {
  try {
    const { name, email, password, aadhaarNumber, phone } = req.body;

    // Check if already exists
    const existingAdmin = await LocalAdmin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Local Admin already exists"
      });
    }

    const newLocalAdmin = await LocalAdmin.create({
      name,
      email,
      password,
      aadhaarNumber,
      phone,
      createdBy: req.user?.id   // Main Admin ID (if auth middleware used)
    });

    res.status(201).json({
      success: true,
      message: "Local Admin created successfully",
      data: newLocalAdmin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// Get All Local Admins
export const getLocalAdmins = async (req, res) => {
  try {
    const admins = await LocalAdmin.find().select("-password");

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// Update Local Admin
export const updateLocalAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAdmin = await LocalAdmin.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Local Admin not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Local Admin updated successfully",
      data: updatedAdmin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// Delete Local Admin
export const deleteLocalAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await LocalAdmin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Local Admin not found"
      });
    }

    await admin.deleteOne();

    res.status(200).json({
      success: true,
      message: "Local Admin deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};