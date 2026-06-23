import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { Button } from "./Button";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const ConfirmDialog = ({
  open,
  title,
  children,
  confirmLabel = "Konfirmasi",
  confirmVariant = "danger",
  onClose,
  onConfirm,
  loading = false,
}: ConfirmDialogProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        width: { xs: "100%", sm: 380 },
        m: { xs: 2, sm: "auto" },
      },
    }}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Box
        sx={{
          fontSize: "0.9rem",
          color: "var(--text-muted)",
          lineHeight: 1.7,
        }}
      >
        {children}
      </Box>
    </DialogContent>
    <DialogActions>
      <Button variant="secondary" onClick={onClose}>
        Batal
      </Button>
      <Button
        variant={confirmVariant}
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? "Memproses..." : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);
