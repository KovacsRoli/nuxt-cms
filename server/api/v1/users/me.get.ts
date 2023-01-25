import UserService from '~~/server/services/user'
import { errors } from '~~/server/models/Exception'
import { errorResponse } from '~~/server/error'

export default defineEventHandler(async (event) => {
  const userService = new UserService()
  try {
    const { userId } = event.context.user
    if (!userId) return errorResponse(errors.unauthorized, event)

    const user = await userService.findById(userId)
    if (!user) return errorResponse(errors.notFound(`user with id ${userId}`), event)

    return { data: user }
  } catch (e) {
    return errorResponse(e, event)
  }
})
