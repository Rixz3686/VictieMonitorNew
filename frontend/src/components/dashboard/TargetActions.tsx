import { Box } from "@mui/material";
import { Button } from "../common/Button";

interface TargetActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function TargetActions({ onEdit, onDelete }: TargetActionsProps) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 2,
        borderTop: "1px solid var(--border-light)",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Button variant="primary" onClick={onEdit} fullWidth style={{ borderRadius: 10 }}>
        Edit Target
      </Button>
      <Button variant="secondary" onClick={onDelete} fullWidth>
        Hapus Target
      </Button>
    </Box>
  );
}
