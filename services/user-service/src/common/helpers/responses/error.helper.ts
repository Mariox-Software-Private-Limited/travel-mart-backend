import { statusBadRequest } from "src/common/constants/response.status.constant";

export function errorResponse(
  status = statusBadRequest,
  message: string,
  data: object
) {
  return { status, message, data };
}
