import {
  statusBadRequest,
  statusOk,
} from 'src/common/constants/response.status.constant';

export function successResponse(
  message: string,
  data: unknown,
  statusCode = statusOk,
) {
  return { statusCode, message, data };
}

export function badResponse(
  message: string,
  data: unknown,
  statusCode = statusBadRequest,
) {
  return { statusCode, message, data };
}
