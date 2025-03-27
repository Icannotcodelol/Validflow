import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  usage: {
    analysisCount: number;
    monthlyQuota: number;
    remainingQuota: number;
  };
  settings: {
    emailNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    usage: {
      analysisCount: {
        type: Number,
        default: 0,
      },
      monthlyQuota: {
        type: Number,
        default: 5,
      },
      remainingQuota: {
        type: Number,
        default: 5,
      },
    },
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add any pre-save hooks, methods, or statics here
userSchema.pre("save", function(this: IUser, next: mongoose.CallbackWithoutResultAndOptionalError) {
  // Reset quota at the beginning of each month
  const now = new Date();
  const lastUpdated = this.updatedAt || now;
  
  if (now.getMonth() !== lastUpdated.getMonth() || now.getFullYear() !== lastUpdated.getFullYear()) {
    this.usage.remainingQuota = this.usage.monthlyQuota;
  }
  
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User; 