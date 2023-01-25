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
    const { email, password } = await readBody(event)
    if (!email || (email && !validateEmail(email)))
      return errorResponse(errors.incorrectEmailOrPassword, event)
    if (!password || password.length < 8)
      return errorResponse(errors.incorrectEmailOrPassword, event)

    const user = await authService.login(email, password)
    const authToken = jwt.sign({ userId: user._id, date: new Date() }, jwtAccessSecret, {
      expiresIn: jwtAccessExpiresIn,
    })
    const refreshToken = jwt.sign({ userId: user._id, date: new Date() }, jwtRefreshSecret, {
      expiresIn: jwtRefreshExpiresIn,
    })
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
