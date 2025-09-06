import { useAuth } from "@clerk/nextjs";


export function usePlanAccess(){
    const { has } = useAuth();

    const isPro = has?.({plan: "pro"}) || false;

    const isFree = !isPro;

    const planAccess = {
        resize: true,
        crop: true,
        adjust: true,
        text: true,
        background: true,
        ai_extender: isPro,
        ai_edit: isPro,
    };


    const hasAccess = (toolId) => {
        return planAccess[toolId] === true;
    };


    const getRestrictedTools = () => {
        return Object.entries(planAccess)
            .filter(([_, hasAccess]) => !hasAccess)
            .map((toolId) => toolId)
    };

    const canCreateProject = (currentProjectCount) => {
        if (isPro) return true;
        return currentProjectCount < 5;
    }

    const canExport = (currentExportsThisMonth) => {
        if (isPro) return true;
        return currentExportsThisMonth < 10;
    }

    return {
        userPlan: isPro ? "pro" : "free_user",
        isPro,
        isFree,
        hasAccess,
        planAccess,
        getRestrictedTools,
        canCreateProject,
        canExport
    };
}