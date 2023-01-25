import mongoose, { CallbackError, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { capitalizeString } from '../utils/helperFunctions'

export enum UserType {
  customer = 'customer',
  admin = 'admin',
  superAdmin = 'superAdmin',
}

export enum UserStatus {
  active = 'active',
  suspended = 'suspended',
  // pending = 'pending',
}

export interface User extends Document {
  _id?: string
  email: string
  password?: string
  firstName: string
  lastName: string
  fullName: string
  status: UserStatus
  type: UserType
  forgotPasswordCode?: string
  emailConfirmation: {
    code?: string
    confirmed: boolean
  }
  social?: {
    github?: { id: string }
    google?: { id: string }
    apple?: { id: string }
  }
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, index: true },
    password: { type: String, select: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String },
    type: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.customer,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.active,
      required: true,
    },
    forgotPasswordCode: { type: String, select: false },
    emailConfirmation: {
      confirmed: { type: Boolean, default: false },
      code: { type: String, select: false },
    },

    // social accounts
    social: {
      type: {
        github: { id: { type: String, required: true, index: true } },
        google: { id: { type: String, required: true, index: true } },
        apple: { id: { type: String, required: true, index: true } },
      },
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
)
userSchema.pre('save', async function (next) {
  // if password is not provided or not a string, skip hashing
  if (!this.password && typeof this.password !== 'string') return next()
  if (!this.isModified('password')) return next()

  const { saltRounds } = useRuntimeConfig()
  try {
    const salt = await bcrypt.genSalt(saltRounds)
    this.password = await bcrypt.hash(this.password, salt)
    this.firstName = capitalizeString(this.firstName.trim())
    this.lastName = capitalizeString(this.lastName.trim())
    this.fullName = `${this.firstName} ${this.lastName}`
    return next()
  } catch (err) {
    return next(err as CallbackError)
  }
})

export default mongoose.model<User>('User', userSchema)
