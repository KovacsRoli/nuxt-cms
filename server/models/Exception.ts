/* eslint-disable */
// prettier-ignore
export class Exception{

  constructor(
      public statusCode: number,
      public data: string,
  ) {
  }
}

// prettier-ignore
/* eslint-disable */
export const errors = {
  unknown: new Exception(400, 'An unknown error occurred. Please try again later.'),
  unauthorized: new Exception(401, 'You are not authorized to access this resource.'),
  emailInUse: new Exception(422, 'A user with this email already exists. Please use another email or login with your account.'),
  phoneNumberInUse: new Exception(422, 'A user with this phone already exists. Please use another phone or login with your account.'),
  suspendedAccount: new Exception(422, 'Your account is suspended.'),
  incorrectEmailOrPassword: new Exception(422, 'Incorrect email or password. Please try again.'),

  notFound: (resource: string) => new Exception(404, `The requested ${resource} was not found.`),
  invalidParameter: (param: string) => new Exception(422, `Missing or invalid parameter '${param}'.`),
  restrictedParameter: (param: string) => new Exception(401, `You are not authorized to update the '${param}'.`),
};
/* eslint-enable */
