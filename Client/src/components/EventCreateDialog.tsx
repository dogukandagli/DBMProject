import { Dialog, TextField } from "@mui/material";

type EventCreateDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function EventCreateDialog({
  open,
  onClose,
}: EventCreateDialogProps) {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: (theme) => ({
            margin: 0,
            width: { xs: "100vw", sm: "720px" },
            height: { xs: "100dvh", sm: "500px" },
            maxWidth: { xs: "100vw", sm: "720px" },
            maxHeight: { xs: "100dvh", sm: "none" },

            borderRadius: { xs: 0, sm: 4.5 },
            py: 2,
            px: 1,
            position: "absolute",
            top: { xs: "0px", sm: "75px" },
            backgroundColor: theme.palette.background.default,
          }),
        }}
      >
        <TextField />
      </Dialog>
    </>
  );
}
