import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { usePlanAccess } from "@/hooks/use-plan-access";
import { Crown, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UpgradeModal } from "@/components/UpgradeModal";

const NewProjectModel = ({ isOpen, onClose }) => {
  const router = useRouter();

  const onDrop = (acceptedFile) => {
    const file = acceptedFile[0];

    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      const nameWithoutExt = file.name.replace(/\.[^/.]+/, "");
      setProjectTitile(nameWithoutExt || "Untitled Project");
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [projectTitle, setProjectTitile] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const handleClose = () => {
    setProjectTitile("");
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsUploading(false);
    onClose();
  };

  const { data: projects } = useConvexQuery(api.projects.getUserProjects);
  const { mutate: createProject } = useConvexMutation(api.projects.create);

  const currentProjectCount = projects?.length || 0;

  const { isFree, canCreateProject } = usePlanAccess();

  const canCreate = canCreateProject(currentProjectCount);

  const handleCreateProject = async () => {
    if (!canCreate) {
      setShowUpgradeModal(true);
      return;
    }

    if (!selectedFile || !projectTitle.trim()) {
      toast.error("Please select an image and enter a project title");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);

      const uploadResponse = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      const projectId = await createProject({
        title: projectTitle.trim(),
        originalImageUrl: uploadData.url,
        currentImageUrl: uploadData.url,
        thumbnailUrl: uploadData.thumbnailUrl,
        width: uploadData.width || 800,
        height: uploadData.height || 600,
        canvasState: null,
      });

      toast.success("Project created successfully!");

      router.push(`/editor/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(
        error.message || "Failed to create project. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-2xl font-bold text-white"}>
              Create a new Project
            </DialogTitle>
            {isFree && (
              <Badge
                variant={"secondary"}
                className={"bg-slate-700 text-white/70"}
              >
                {currentProjectCount}/5 projects
              </Badge>
            )}
          </DialogHeader>
          <div className="space-y-6">
            {isFree && currentProjectCount >= 4 && (
              <Alert className={"bg-amber-500/10 border-amber-500/20"}>
                <Crown className="h-5 w-5 text-amber-400" />
                <AlertDescription className={"text-amber-300/80"}>
                  <div className="font-semibold text-amber-400 mb-1">
                    {currentProjectCount === 4
                      ? "Last Free Project"
                      : "Project Limit Reached"}

                    {currentProjectCount === 4
                      ? "This will be your last free project. Upgrade to pro for more usage."
                      : "Free plan is limited to 5 projects. Upgarde to pro for more projects."}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* upload area */}
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${isDragActive ? "border-cyan-500 bg-cyan-400/50" : "border-white/20 hover:border-white/40"} ${!canCreate ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? "Drop your Image" : "Uplad an Image"}
                </h3>
                <p>
                  {canCreate
                    ? "Drag and drop your image."
                    : "Upfrade to pro for create more projects"}
                </p>{" "}
                <p className="text-sm text-white/50">
                  Supports PNG,JPG,JPEG up to 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl border border-white/10"
                  />
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={
                      "absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                    }
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setProjectTitile("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-title" className={"text-white"}>
                    Project Title
                  </Label>
                  <Input
                    id="project-title"
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitile(e.target.value)}
                    placeholder="Enter project name..."
                    className={
                      "bg-slate-700 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                    }
                  />
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-white font-medium">
                        {selectedFile.name}
                      </p>
                      <p className="text-white/70 text-sm">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className={"gap-4"}>
            <Button
              variant={"ghost"}
              onClick={handleClose}
              disabled={isUploading}
              className={"text-white/70 hover:text-white"}
            >
              Cancel
            </Button>

            <Button
              variant={"primary"}
              onClick={handleCreateProject}
              disabled={!selectedFile || !projectTitle.trim() || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} restrictedTool="projects" reason="Free plan is limited to 5 projects. Upgrade to Pro for unlimited projects and access to all tools"/>
    </>
  );
};
export default NewProjectModel;
