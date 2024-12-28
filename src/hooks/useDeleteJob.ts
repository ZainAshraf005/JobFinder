import { apiHandler } from "@/handlers/apiErrorHandler";
import axios from "axios";
import toast from "react-hot-toast";

export const useDeleteJob = () => {
  const delJob = async (id: string) => {
    try {
      const response = await axios.post("/api/job/delete", { id });
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      apiHandler(error);
    }
  };

  return delJob;
};
