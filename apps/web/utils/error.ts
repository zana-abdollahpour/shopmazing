const formatErrorMessage = (message: string) => {
  return message.charAt(0).toUpperCase() + message.slice(1);
};

export const getErrorMessage = (errorResponse: unknown) => {
  if (errorResponse === null || errorResponse === undefined) {
    return "Unknown Error";
  }

  if (typeof errorResponse === "string") {
    return errorResponse;
  }

  if (typeof errorResponse === "object" && "message" in errorResponse) {
    if (Array.isArray(errorResponse.message)) {
      return formatErrorMessage(errorResponse.message[0] as string);
    }
    return formatErrorMessage(errorResponse.message as string);
  }

  return "Unknown Error";
};
