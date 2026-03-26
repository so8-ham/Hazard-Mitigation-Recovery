import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const localAdminSchema = new mongoose.Schema(
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

    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"]
    },

    role: {
      type: String,
      default: "LOCAL_ADMIN"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainAdmin",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
localAdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password during login
localAdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const LocalAdmin = mongoose.model("LocalAdmin", localAdminSchema);

export default LocalAdmin;