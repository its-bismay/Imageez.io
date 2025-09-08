"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useCanvas } from "@/context/context";
import { usePlanAccess } from "@/hooks/use-plan-access";
import { ArrowLeft, ChevronDown, Crop, Download, Expand, Eye, FileImage, Loader2, Lock, Maximize2, Palette, RotateCcw, RotateCw, Sliders, Text } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TOOLS = [
    {
      id: "resize",
      label: "Resize",
      icon: Expand,
      isActive: true,
    },
    {
      id: "crop",
      label: "Crop",
      icon: Crop,
    },
    {
      id: "adjust",
      label: "Adjust",
      icon: Sliders,
    },
    {
      id: "text",
      label: "Text",
      icon: Text,
    },
    {
      id: "background",
      label: "AI Background",
      icon: Palette,
      proOnly: false,
    },
    {
      id: "ai_extender",
      label: "AI Image Extender",
      icon: Maximize2,
      proOnly: true,
    },
    {
      id: "ai_edit",
      label: "AI Editing",
      icon: Eye,
      proOnly: true,
    },
  ];

  const EXPORT_FORMATS = [
    {
      format: "PNG",
      quality: 1.0,
      label: "PNG (High Quality)",
      extension: "png",
    },
    {
      format: "JPEG",
      quality: 0.9,
      label: "JPEG (90% Quality)",
      extension: "jpg",
    },
    {
      format: "JPEG",
      quality: 0.8,
      label: "JPEG (80% Quality)",
      extension: "jpg",
    },
    {
      format: "WEBP",
      quality: 0.9,
      label: "WebP (90% Quality)",
      extension: "webp",
    },
  ];



const EditorTopBar = ({project}) => {
    const router = useRouter();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [restrictedTool, setRestrictedTool] = useState(null);

    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [isUndoRedoOperation, setIsUndoRedoOperation] = useState(false);

    const {activeTool, onToolChange, canvasEditor} = useCanvas();
    const {hasAccess, canExport, isFree} = usePlanAccess();

    const handleBackToDashboard = () => {
        router.push("/dashboard")
    }

    const handleToolChange = (toolId) => {
        if (!hasAccess(toolId)) {
            setRestrictedTool(toolId);
            setShowUpgradeModal(true);
            return;
        }

        onToolChange(toolId)
}

const handleUndo = () => {

}



const canUndo = undoStack.length > 1;
const canRedo = redoStack.length > 0;


if (!project) {
    return (
        <div className="border-b px-6 py-3">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToDashboard}
                        className="text-white hover:text-gray-300"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        All Projects
                    </Button>
                </div>
                
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-white/70">Loading project...</span>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Empty space for layout consistency */}
                </div>
            </div>
            
            {/* Skeleton for tools */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="h-8 w-20 bg-slate-700 animate-pulse rounded" />
                    ))}
                </div>
                <div className="flex items-center gap-1">
                    <div className="h-8 w-8 bg-slate-700 animate-pulse rounded" />
                    <div className="h-8 w-8 bg-slate-700 animate-pulse rounded" />
                </div>
            </div>
        </div>
    );
}

  return (
    <>
          <div className="border-b px-6 py-3">

        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="text-white hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Projects
            </Button>
          </div>

          <h1 className="font-extrabold capitalize">{project.title}</h1>

          <div className="flex items-center gap-3">

            Right Actions

            {/* <Button
              variant="outline"
              size="sm"
              onClick={handleResetToOriginal}
              disabled={isSaving || !project.originalImageUrl}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4" />
                  Reset
                </>
              )}
            </Button>


            <Button
              variant="primary"
              size="sm"
              onClick={handleManualSave}
              disabled={isSaving || !canvasEditor}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="glass"
                  size="sm"
                  disabled={isExporting || !canvasEditor}
                  className="gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Exporting {exportFormat}...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-800 border-slate-700"
              >
                <div className="px-3 py-2 text-sm text-white/70">
                  Export Resolution: {project.width} × {project.height}px
                </div>

                <DropdownMenuSeparator className="bg-slate-700" />

                {EXPORT_FORMATS.map((config, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleExport(config)}
                    className="text-white hover:bg-slate-700 cursor-pointer flex items-center gap-2"
                  >
                    <FileImage className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{config.label}</div>
                      <div className="text-xs text-white/50">
                        {config.format} • {Math.round(config.quality * 100)}%
                        quality
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="bg-slate-700" />


                {isFree && (
                  <div className="px-3 py-2 text-xs text-white/50">
                    Free Plan: {user?.exportsThisMonth || 0}/20 exports this
                    month
                    {(user?.exportsThisMonth || 0) >= 20 && (
                      <div className="text-amber-400 mt-1">
                        Upgrade to Pro for unlimited exports
                      </div>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>


        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              const hasToolAccess = hasAccess(tool.id);

              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleToolChange(tool.id)}
                  className={`gap-2 relative ${
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-white hover:text-gray-300 hover:bg-gray-100"
                  } ${!hasToolAccess ? "opacity-60" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  {tool.label}
                  {tool.proOnly && !hasToolAccess && (
                    <Lock className="h-3 w-3 text-amber-400" />
                  )}
                </Button>
              );
            })}
          </div>


          <div className="flex items-center gap-4">

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`text-white`}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`text-white`}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>


      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          setRestrictedTool(null);
        }}
        restrictedTool={restrictedTool}
        reason={
          restrictedTool === "export"
            ? "Free plan is limited to 10 exports per month. Upgrade to Pro for unlimited exports."
            : undefined
        }
      /></>
  )
}
export default EditorTopBar