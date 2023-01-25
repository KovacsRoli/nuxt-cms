import UserModel, { User } from '../models/User'
import { capitalizeString } from '../utils/helperFunctions'

export default class UserService {
  public async findById(id: string): Promise<User | null> {
    return UserModel.findById(id)
  }

  public async update(id: string, updateUser: Partial<User>): Promise<User | null> {
    if (updateUser.firstName) updateUser.firstName = capitalizeString(updateUser.firstName.trim())
    if (updateUser.lastName) updateUser.lastName = capitalizeString(updateUser.lastName.trim())

    updateUser.fullName = `${updateUser.firstName} ${updateUser.lastName}`
    return UserModel.findOneAndUpdate({ _id: id }, updateUser, { new: true })
  }
}
