import UserService from '~~/server/services/user'
import { errors } from '~~/server/models/Exception'
import { errorResponse } from '~~/server/error'
import { User } from '~~/server/models/User'

export default defineEventHandler(async (event) => {
  const userService = new UserService()
  try {
    const { userId } = event.context.user
    if (!userId) return errorResponse(errors.unauthorized, event)

    const body = await readBody(event)
    // if (updateUser?.password) return errorResponse(errors.restrictedParameter('password'), event)
    // if (updateUser?.email) return errorResponse(errors.restrictedParameter('email'), event)
    const updateUser: Partial<User> = {}
    if (body.hasOwnProperty('firstName') && body.firstName.trim().length < 1)
      return errorResponse(errors.invalidParameter('firstName'), event)
    if (body.hasOwnProperty('lastName') && body.lastName.trim().length < 1)
      return errorResponse(errors.invalidParameter('lastName'), event)

    updateUser.firstName = body.firstName.trim()
    updateUser.lastName = body.lastName.trim()

    const user = await userService.update(userId, updateUser)
    if (!user) return errorResponse(errors.notFound(`user with id ${userId}`), event)

    return { data: user }
  } catch (e) {
    return errorResponse(e, event)
  }
})
