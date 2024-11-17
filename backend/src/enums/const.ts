export enum TokenType {
  RESET = 'reset',
  LOGIN = 'login'
}

export enum ErrorType {
  INVALID_CREDENTIALS = "Invalid credentials.",
  USER_ALREADY_EXISTS = "The user already exists.",
  USER_NOT_FOUND = "User not found.",
  VERIFICATION_CODE_NOT_FOUND = "Verification code not found.",
  UNAUTHORIZED_ACTION = "Unauthorized action.",
  ERROR_DURING_REQUEST = "Error during the request.",
  PASSWORD_RESET_FAILED = "Password reset failed.",
  RESOURCE_NOT_FOUND = "Resource not found",
  SALT_IS_NOT_A_STRING = "Salt is not a string",
  VERIFICATION_ERROR = "oops! something went wrong during verification"
}
