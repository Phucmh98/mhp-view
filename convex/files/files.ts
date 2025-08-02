import { mutation } from "../_generated/server";

// Function để lấy upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async ({ storage, auth }) => {
    return await storage.generateUploadUrl();
  },
});