import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const mainAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, "Aadhaar number must be 12 digits"]
    },

    role: {
      type: String,
      default: "MAIN_ADMIN"
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
mainAdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password during login
mainAdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MainAdmin = mongoose.model("MainAdmin", mainAdminSchema);

export default MainAdmin;