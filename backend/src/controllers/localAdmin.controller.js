import LocalAdmin from "../models/localadmin.model.js";



// Get Local Admin Profile
export const getLocalAdminProfile = async (req, res) => {
  try {
    const admin = await LocalAdmin.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Local Admin not found"
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// Update Local Admin Profile
export const updateLocalAdminProfile = async (req, res) => {
  try {
    const { name, email, aadhaarNumber } = req.body;

    const updatedAdmin = await LocalAdmin.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        aadhaarNumber
      },
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
      message: "Profile updated successfully",
      data: updatedAdmin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// Delete Local Admin Account
export const deleteLocalAdminAccount = async (req, res) => {
  try {
    const admin = await LocalAdmin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    await admin.deleteOne();

    res.status(200).json({
      success: true,
      message: "Local Admin account deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};