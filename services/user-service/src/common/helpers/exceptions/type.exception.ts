import { HttpException, HttpStatus } from '@nestjs/common';

export const TypeExceptions = {
  UserNotFound(): any {
    return new HttpException(
      {
        message: 'User not found',
        data: {},
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  },

  UserAlreadyExists(): any {
    return new HttpException(
      {
        message: 'User already exists',
        data: {},
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  },

  UserAlreadyExistsWithEmail(): any {
    return new HttpException(
      {
        message: 'User already exists with this email',
        data: {},
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  },

  UserAlreadyExistsWithPhoneNumber(): any {
    return new HttpException(
      {
        message: 'User already exists with this phone number',
        data: {},
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  },

  InvalidFile(msg: string): any {
    return new HttpException(
      {
        message: msg,
        data: {},
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  DeviceNotFound(): any {
    return new HttpException(
      {
        message: 'Device details not found',
        data: {},
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  },

  AdminNotFound(): any {
    return new HttpException(
      {
        message: 'Admin not found',
        data: {},
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  },

  VendorNotFound(): any {
    return new HttpException(
      {
        message: 'Vendor not found',
        data: {},
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  },

  /*Common error msg throw function*/
  NotFoundCommMsg(msg) {
    return new HttpException(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: msg,
        data: {},
      },
      HttpStatus.NOT_FOUND,
    );
  },

  BadReqCommMsg(msg) {
    return new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: msg,
        data: {},
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  UnknownError(message) {
    return new HttpException(
      {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: message,
        data: {},
      },
      HttpStatus.BAD_GATEWAY,
    );
  },

  Unauthorized(message) {
    return new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: message,
        data: {},
      },
      HttpStatus.UNAUTHORIZED,
    );
  },

  CouponCodeUsageLimit(): any {
    return new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          "This Coupon Code's usage limit is over please try another coupon code",
        data: {},
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  CouponCodeExpired(): any {
    return new HttpException(
      {
        message: 'This Coupon Code is expired, please try another coupon code',
        data: {},
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  CouponCodeUserNotFound(): any {
    return new HttpException(
      {
        message:
          'This coupon is not valid for this user, please try another coupon code',
        data: {},
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  CouponCodeMinimumAmount(minimumAmount: any): any {
    return new HttpException(
      {
        message: `This coupon code is applicable on minimum booking of ${minimumAmount}, please try another coupon code`,
        data: {},
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  CouponCodeCategoryNotMatch(): any {
    return new HttpException(
      {
        message:
          'This coupon is not applicable on selected category,please try another coupon code',
        data: {},
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  CouponCodeNotFound(): any {
    return new HttpException(
      {
        message: 'This coupon is not valid, please try another coupon code',
        data: {},
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  VendorHasOngoingBooking(): any {
    return new HttpException(
      {
        message: 'Vendor has ongoing booking so u cannot delete it',
        data: {},
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },
};
