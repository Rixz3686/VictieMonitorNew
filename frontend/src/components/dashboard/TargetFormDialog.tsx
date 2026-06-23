import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { PROTOCOLS } from "../../utils/constants";
import type { TargetFormData } from "../../types";

interface TargetFormDialogProps {
  open: boolean;
  editingId: string | null;
  form: TargetFormData;
  onClose: () => void;
  onChange: (field: keyof TargetFormData, value: string | number) => void;
  onSave: () => void;
}

export const TargetFormDialog = ({
  open,
  editingId,
  form,
  onClose,
  onChange,
  onSave,
}: TargetFormDialogProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        width: { xs: "100%", sm: 440 },
        m: { xs: 2, sm: "auto" },
      },
    }}
  >
    <DialogTitle
      sx={{
        fontSize: "1.1rem",
        borderBottom: (theme) => `1px solid ${theme.customTokens.colors.borderLight}`,
      }}
    >
      {editingId ? "Edit Target" : "Target Baru"}
    </DialogTitle>
    <DialogContent
      sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 3 }}
    >
      <Input
        label="Nama Target"
        value={form.name}
        onChange={(val) => onChange("name", val)}
      />
      <Input
        label="Host / IP / URL"
        value={form.host}
        onChange={(val) => onChange("host", val)}
      />
      <Select
        label="Protokol"
        value={form.protocol}
        onChange={(val) => onChange("protocol", val)}
        options={PROTOCOLS}
      />
      {(form.protocol === "TCP" ||
        form.protocol === "HTTP" ||
        form.protocol === "HTTPS") && (
        <Input
          label={`Port ${form.protocol !== "TCP" ? "(opsional)" : ""}`}
          value={form.port}
          type="number"
          onChange={(val) => onChange("port", val)}
        />
      )}
      <Input
        label="Interval (Detik)"
        value={form.interval_seconds}
        type="number"
        min={5}
        onChange={(val) => onChange("interval_seconds", Math.max(parseInt(val) || 5, 5))}
      />
    </DialogContent>
    <DialogActions>
      <Button variant="secondary" onClick={onClose}>
        Batal
      </Button>
      <Button variant="primary" onClick={onSave}>
        {editingId ? "Simpan Perubahan" : "Tambahkan →"}
      </Button>
    </DialogActions>
  </Dialog>
);
