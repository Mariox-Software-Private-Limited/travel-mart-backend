import { HttpException, HttpStatus } from '@nestjs/common';

export const AuthExceptions = {
  TokenExpired(): any {
    return new HttpException(
      {
        message: 'Token Expired use RefreshToken',
        error: 'TokenExpiredError',
        data: {},
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  InvalidToken(): any {
    return new HttpException(
      {
        message: 'Invalid Token',
        error: 'InvalidToken',
        data: {},
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  ForbiddenException(): any {
    return new HttpException(
      {
        message: 'This resource is forbidden from this user',
        error: 'UnAuthorizedResourceError',
        statusCode: HttpStatus.FORBIDDEN,
        data: {},
      },
      HttpStatus.FORBIDDEN,
    );
  },

  InvalidUserId(): any {
    return new HttpException(
      {
        message: 'Invalid User Id',
        data: {},
        error: 'InvalidUserId',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  InvalidIdPassword(): any {
    return new HttpException(
      {
        message: 'Invalid Username or Password',
        error: 'InvalidIdPassword',
        data: {},
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  },

  AccountNotexist(): any {
    return new HttpException(
      {
        message: 'Account does not exist!',
        error: 'accountNotexist',
        data: {},
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  AccountDeleted(): any {
    return new HttpException(
      {
        message: 'The user account is deleted',
        error: 'accountDeleted',
        data: {},
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  AccountNotActive(): any {
    return new HttpException(
      {
        message: 'Your account is deactivated, please contact your admin',
        error: 'accountNotActive',
        data: {},
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  UserNotAuthorizedAccess(): any {
    return new HttpException(
      {
        message: 'Access Denied',
        error: 'UnAuthorizedResourceError',
        data: {},
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  UserNotFoundForEmail(): any {
    return new HttpException(
      {
        message: 'Please enter valid email',
        error: 'userNotFoundForEmail',
        statusCode: HttpStatus.FORBIDDEN,
        data: {},
      },
      HttpStatus.FORBIDDEN,
    );
  },

  UserNotFoundForPhoneNumber(): any {
    return new HttpException(
      {
        message: 'Please enter valid phone number',
        error: 'userNotFoundForPhoneNumber',
        statusCode: HttpStatus.FORBIDDEN,
        data: {},
      },
      HttpStatus.FORBIDDEN,
    );
  },

  InvalidPassword(): any {
    return new HttpException(
      {
        message: 'Please enter valid password',
        error: 'InvalidPassword',
        data: {},
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  },

  InvalidOtp(): any {
    return new HttpException(
      {
        message: 'Please enter valid otp',
        error: 'InvalidOtp',
        data: {},
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  },
};
