import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/features/auth";
import { ApplicationForm } from "./ApplicationForm";

interface ApplyDialogProps {
  jobId: string;
  jobTitle: string;
  isInternship?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AuthGate({ jobTitle }: { jobTitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Lock className="h-7 w-7 text-primary" />
      </div>
      <h2 className="mt-6 font-heading text-xl font-bold text-foreground">
        Sign In to Apply
      </h2>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Create an account or sign in to submit your application for{" "}
        <span className="font-medium text-foreground">{jobTitle}</span>.
      </p>
      <Button asChild className="mt-6 rounded-xl" size="lg">
        <Link to="/signin">Sign In</Link>
      </Button>
    </div>
  );
}

export function ApplyDialog({
  jobId,
  jobTitle,
  isInternship,
  open,
  onOpenChange,
}: ApplyDialogProps) {
  const { user } = useAuth();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="font-heading text-lg font-semibold text-foreground">
            {user ? `Apply for ${jobTitle}` : `Apply for ${jobTitle}`}
          </DialogTitle>
        </DialogHeader>

        {user ? (
          <ScrollArea className="max-h-[calc(90vh-72px)]">
            <div className="px-6 py-6">
              <ApplicationForm
                jobId={jobId}
                jobTitle={jobTitle}
                isInternship={isInternship}
              />
            </div>
          </ScrollArea>
        ) : (
          <AuthGate jobTitle={jobTitle} />
        )}
      </DialogContent>
    </Dialog>
  );
}
