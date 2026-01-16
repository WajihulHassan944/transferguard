import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Shield, ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MFAEnrollment } from "./MFAEnrollment";
import { useMFA } from "@/hooks/useMFA";

export function MFASettings() {
  const { isEnrolled, checkMFAStatus } = useMFA();
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [disabling, setDisabling] = useState(false);

  const handleEnrollmentComplete = () => {
    setEnrollDialogOpen(false);
    checkMFAStatus();
    toast.success("Two-factor authentication enabled!");
  };

  const handleDisableMFA = async () => {
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${isEnrolled ? "bg-primary/10" : "bg-muted"}`}>
          {isEnrolled ? (
            <ShieldCheck className="h-6 w-6 text-primary" />
          ) : (
            <Shield className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isEnrolled 
              ? "Your account is protected with an authenticator app."
              : "Add an extra layer of security to your account by requiring a code from your authenticator app when signing in."
            }
          </p>
          
          {isEnrolled ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <ShieldOff className="h-4 w-4 mr-2" />
                  Disable 2FA
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disable Two-Factor Authentication?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove the extra security layer from your account. You can enable it again at any time.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDisableMFA}
                    disabled={disabling}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {disabling ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Disabling...
                      </>
                    ) : (
                      "Disable 2FA"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Enable 2FA
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                <DialogHeader className="sr-only">
                  <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                  <DialogDescription>
                    Set up an authenticator app to secure your account
                  </DialogDescription>
                </DialogHeader>
                <MFAEnrollment 
                  onComplete={handleEnrollmentComplete}
                  onSkip={() => setEnrollDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </Card>
  );
}
