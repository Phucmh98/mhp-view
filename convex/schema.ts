import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    containProjects: defineTable({
        createdAt: v.string(),
        idCreated: v.string(),
        name: v.string(),
        updatedAt: v.string(),
        fileMetaSrc: v.string(),
        files: v.array(
            v.object({
                storeId: v.string(),
                name: v.string(),
                size: v.number(),
            })
        ),
    }),
   
});