import { errors } from '../models/Exception'
import UserModel, { User, UserStatus } from '../models/User'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

export default class AuthService {
  public async register(newUser: Partial<User>): Promise<User> {
    const existingUser = await UserModel.findOne({ email: newUser.email })
    if (existingUser) throw createError(errors.emailInUse)

    const emailToken = crypto.randomUUID()
    newUser.emailConfirmation = { confirmed: false, code: emailToken }

    const user = JSON.parse(JSON.stringify(await UserModel.create<Partial<User>>(newUser)))
    delete user.password
    delete user.emailConfirmation.code

    return user
  }

  public async login(email: string, password: string): Promise<User> {
    const loginUser = await UserModel.findOne({
      email,
      status: { $nin: [UserStatus.suspended] },
    }).select('+password')
    if (!loginUser?._id) throw createError(errors.incorrectEmailOrPassword)

    if (loginUser.password) {
      const passwordsMatch = await bcrypt.compare(password, loginUser.password)
      if (!passwordsMatch) throw createError(errors.incorrectEmailOrPassword)
    }

    const user = JSON.parse(JSON.stringify(loginUser))
    delete user.password

    return loginUser
  }

  public async findUserById(id: string): Promise<User | null> {
    return UserModel.findById(id)
  }
}
