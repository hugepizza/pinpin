"use client";
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
function Alert({ link }: { link: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="text-primary text-lg font-semibold">
          联系车主上车
          <span className="icon-[mingcute--telegram-line]" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            即将打开纸飞机
            <span className="icon-[mingcute--telegram-line]" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            请仔细甄别拼车信息，本站不负责售后
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>算了</AlertDialogCancel>
          <AlertDialogAction
            className="text-background"
            onClick={() => window.open(link)}
          >
            前往
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Alert;
