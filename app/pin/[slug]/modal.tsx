"use client";
import updateOccupied from "@/app/actions/updateOccupied";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function Modal({
  occupied,
  total,
  pinId,
}: {
  occupied: number;
  total: number;
  pinId: number;
}) {
  const [newOccupied, setNewOccupied] = useState(occupied);
  const [requesting, setRequesting] = useState(false);
  const [open, setOpen] = useState(false);
  const fetch = async () => {
    setRequesting(true);
    updateOccupied({
      pinId,
      newOccupied,
      total,
    })
      .then(() => {
        setOpen(false);
      })
      .finally(() => {
        setRequesting(false);
      });
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogTrigger className="text-background bg-primary py-1 px-2 rounded-sm">
          更新上车人数
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更新上车人数</DialogTitle>
            <DialogDescription>满员后你的TG联系方式将不可见</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) ?? 0;
                  setNewOccupied(value > total ? total : value);
                }}
                type="number"
                value={newOccupied}
                placeholder={occupied.toString()}
                min={0}
                max={total}
              />
            </div>
            <Button
              disabled={requesting}
              type="submit"
              size="sm"
              className="px-3 text-background"
              onClick={fetch}
            >
              确认
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default Modal;
