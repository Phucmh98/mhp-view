import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getAllProjects = query(async ({ db }) => {
  return await db.query("containProjects").collect();
});

export const createProject = mutation({
  args: {
    name: v.string(),
    idCreated: v.string(),
    files: v.array(v.object({
      storageId: v.string(),
      fileName: v.string(),
      fileType: v.string(),
      fileSize: v.number(),
      
    })),
  },
  handler: async (ctx, args) => {
    // Tạo project với user ID tạm thời hoặc anonymous
    const projectId = await ctx.db.insert("containProjects", {
      name: args.name,
      idCreated: args.idCreated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: args.files.map(file => ({
        name: file.fileName,
        storeId: file.storageId,
        size: file.fileSize,
      })), // Lưu storageId như URL
      fileMetaSrc: args.files[0]?.storageId || "", // File đầu tiên làm URL chính
    });

    return projectId;
  },
});