"use client";
import { CanvasContext } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Loader2, Monitor } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import EditorTopBar from "./_components/EditorTopBar";
import CanvasEditor from "./_components/CanvasEditor";
import { EditorSidebar } from "./_components/EditorSidebar";

export default function Editor() {
  const params = useParams();
  const projectId = params.projectId;

  const [canvasEditor, setCanvasEditor] = useState(null);
  const [processingMessage, setProcessingMessage] = useState(null);

  const [activeTool, setActiveTool] = useState("resize");

  const {
    data: project,
    isLoading,
    error,
  } = useConvexQuery(api.projects.getProject, { projectId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if(error || !project){
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Project Not Found</h1>
        <p className="text-white/70">The project you're looking for doesn't exist or you don't have access to it</p>
      </div>
    </div>
  }

    return (
      <CanvasContext.Provider
        value={{
          canvasEditor,
          setCanvasEditor,
          activeTool,
          onToolChange: setActiveTool,
          processingMessage,
          setProcessingMessage,
        }}
      >
        <div className="lg:hidden min-h-screen bg-slate-900 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <Monitor className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">
              Desktop Required
            </h1>
            <p className="text-white/70 text-lg mb-2">
              This editor is only usable on desktop.
            </p>
            <p className="text-white/50 text-sm">
              Please use a larger screen to access the full editing experience.
            </p>
          </div>
        </div>

        <div className="hidden lg:block min-h-screen bg-slate-900">
          <div className="flex flex-col h-screen">
            {processingMessage && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center">
                <div className="rounded-lg p-6 flex flex-col items-center gap-4">
                  <RingLoader color="#fff" />
                  <div className="text-center">
                    <p className="text-white font-medium">
                      {processingMessage}
                    </p>
                    <p className="text-white/70 text-sm mt-1">
                      Please wait, do not switch tabs or navigate away
                    </p>
                  </div>
                </div>
              </div>
            )}

            <EditorTopBar project={project} />

            <div className="flex flex-1 overflow-hidden">
              <EditorSidebar project={project} />

              <div className="flex-1 bg-slate-800">
                <CanvasEditor project={project} activeTool={activeTool} />
              </div>
            </div>
          </div>
        </div>
      </CanvasContext.Provider>
    );
  }
