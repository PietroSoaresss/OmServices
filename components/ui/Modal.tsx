"use client";

import { Button } from "@/components/ui/Button";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function Modal({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  onClose,
  onConfirm
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
