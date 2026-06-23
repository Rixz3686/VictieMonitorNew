import { useState } from "react";
import type { Target, TargetFormData } from "../types";

export const useTargetForm = (initialTarget?: Target) => {
  const [form, setForm] = useState<TargetFormData>({
    name: initialTarget?.name || "",
    host: initialTarget?.host || "",
    port: initialTarget?.port?.toString() || "",
    protocol: initialTarget?.protocol || "HTTP",
    interval_seconds: initialTarget?.interval_seconds || 60,
  });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({
      name: "",
      host: "",
      port: "",
      protocol: "HTTP",
      interval_seconds: 60,
    });
    setOpen(true);
  };

  const handleOpenEdit = (target: Target) => {
    setEditingId(target.id);
    setForm({
      name: target.name,
      host: target.host,
      port: target.port?.toString() || "",
      protocol: target.protocol,
      interval_seconds: target.interval_seconds || 60,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleChange = (field: keyof TargetFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getPayload = () => ({
    ...form,
    port: form.port ? parseInt(form.port) : null,
  });

  return {
    form,
    open,
    editingId,
    handleOpenNew,
    handleOpenEdit,
    handleClose,
    handleChange,
    getPayload,
  };
};
