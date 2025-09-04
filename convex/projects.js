import { v } from "convex/values";
import { mutation, query} from "./_generated/server";
import { internal } from "./_generated/api"

export const create = mutation({
  args: {
    title: v.string(),
    originalImageUrl: v.optional(v.string()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    width: v.number(),
    height: v.number(),
    canvasState: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    if (user.plan === "free") {
        const projectCount = await ctx.db
            .query("projects")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();


        if(projectCount.length >= 5){
            throw new Error (
                "Free plan is limited to 5 projects. Upgrade to pro plan for unlimited projects"
            )
        }
    }

    await ctx.db.insert("projects", {
        title: args.title,
        originalImageUrl: args.originalImageUrl,
        currentImageUrl: args.currentImageUrl,
        thumbnailUrl: args.thumbnailUrl,
        width: args.width,
        height: args.height,
        canvasState: args.canvasState,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });

    await ctx.db.patch(user._id, {
        projectsUsed: user.projectsUsed + 1,
        lastActiveAt:  Date.now(),
    })

    return projectId;
  },
});


export const getUserProjects =  query({
    handler: async(ctx) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);

        const projects = await ctx.db
            .query("projects")
            .withIndex("by_user_updated", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect()

        return projects;
    }
})


export const deleteProject = mutation({
    args: {projectId: v.id("projects")},
    handler: async(ctx, args) => {
        const user = await ctx.runQuery(internal.users.getCurrentUser);

        const project = await ctx.db.get(args.projectId);

        if(!project){
            throw new Error("Project not found");
        }

        if(!user || project.userId !== user._id){
            throw new Error("Access denied")
        }

        await ctx.db.delete(args.projectId);

        await ctx.db.patch(user._id, {
            projectsUsed: Math.max(0, user.projectsUsed - 1),
            lastActiveAt:  Date.now(),
        })

        return {success: true}
    }
})
