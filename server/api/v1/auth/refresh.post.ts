import { errorResponse } from '~~/server/error'
import { errors } from '~~/server/models/Exception'
import AuthService from '~~/server/services/auth'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const authService = new AuthService()
  const { jwtAccessSecret, jwtRefreshSecret, jwtAccessExpiresIn } = useRuntimeConfig()
  try {
    const { refreshToken } = await readBody(event)
    let legit: string | jwt.JwtPayload
    try {
      legit = jwt.verify(refreshToken, jwtRefreshSecret)
    } catch (error) {
      return errorResponse(errors.unauthorized, event)
    }
    if (!refreshToken || !legit) return errorResponse(errors.unauthorized, event)
    const { userId } = jwt.decode(refreshToken) as { userId: string }

    const user = await authService.findUserById(userId)
    if (!user) return errorResponse(errors.unauthorized, event)
    const authToken = jwt.sign({ userId: user._id, date: new Date() }, jwtAccessSecret, {
      expiresIn: jwtAccessExpiresIn,
    })
    return {
      data: {
        accessToken: authToken,
      },
    }
  } catch (e) {
    return errorResponse(e, event)
  }
})
