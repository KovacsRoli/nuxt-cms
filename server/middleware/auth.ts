import jwt from 'jsonwebtoken'
import { errorResponse } from '../error'
import { errors } from '../models/Exception'
import { UserStatus } from '../models/User'
import AuthService from '../services/auth'

export default defineEventHandler(async (event) => {
  const authService = new AuthService()
  const { jwtAccessSecret } = useRuntimeConfig()
  if (!event.node.req.url?.startsWith('/api') || event.node.req.url?.includes('auth')) {
    return
  }
  const token = getHeader(event, 'Authorization')?.split(' ')[1]
  if (!token) return errorResponse(errors.unauthorized, event)
  let legit: string | jwt.JwtPayload
  try {
    legit = jwt.verify(token, jwtAccessSecret)
  } catch (e) {
    return errorResponse(errors.unauthorized, event)
  }
  if (!legit) return errorResponse(errors.unauthorized, event)

  //   const isVerified = await JwtWhitelistService.verify(token);
  //   if (!isVerified) return errorResponse(errors.unauthorized, event);

  const { userId } = jwt.decode(token) as { userId: string }

  if (!userId) return errorResponse(errors.unauthorized, event)

  const user = await authService.findUserById(userId)
  if (!user) return errorResponse(errors.unauthorized, event)

  if (user.status === UserStatus.suspended) return errorResponse(errors.suspendedAccount, event)

  event.context.user = {
    authenticated: true,
    userId,
  }
})
