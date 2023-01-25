import { errorResponse } from '~~/server/error'
import { errors } from '~~/server/models/Exception'
import AuthService from '~~/server/services/auth'
import { validateEmail } from '~~/server/utils/validation'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const authService = new AuthService()
  const { jwtAccessSecret, jwtRefreshSecret, jwtAccessExpiresIn, jwtRefreshExpiresIn } =
    useRuntimeConfig()
  try {
    const body = await readBody(event)
    if (!body.email || !validateEmail(body.email))
      return errorResponse(errors.invalidParameter('email'), event)
    if (!body.password || body.password.length < 8)
      return errorResponse(errors.invalidParameter('password'), event)
    if (!body.firstName || body.firstName.trim().length < 1)
      return errorResponse(errors.invalidParameter('firstName'), event)
    if (!body.lastName || body.lastName.trim().length < 1)
      return errorResponse(errors.invalidParameter('lastName'), event)
    const user = await authService.register(body)
    const authToken = jwt.sign({ userId: user._id, date: new Date() }, jwtAccessSecret, {
      expiresIn: jwtAccessExpiresIn,
    })
    const refreshToken = jwt.sign({ userId: user._id, date: new Date() }, jwtRefreshSecret, {
      expiresIn: jwtRefreshExpiresIn,
    })
    event.node.res.statusCode = 201
    return {
      data: {
        user,
        accessToken: authToken,
        refreshToken: refreshToken,
      },
    }
  } catch (e) {
    return errorResponse(e, event)
  }
})
