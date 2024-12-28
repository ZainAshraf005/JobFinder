import toast from "react-hot-toast";

export const apiHandler = (error: unknown) => {
  if (error instanceof Error && "response" in error && error.response) {
    const responseError = error as { response: { data: { message: string } } };
    toast.error(responseError.response.data.message);
  } else {
    toast.error("An unexpected error occurred.");
  }
};
