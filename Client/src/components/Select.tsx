import {
  Box,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";

export type FancyOptionValue = string | number;

export type FancyOption = {
  value: FancyOptionValue;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

type SelectProps = {
  options: FancyOption[];
  value: FancyOptionValue;
  onChange: (value: FancyOptionValue) => void;
  title: string;
  triggerLabel?: string;
};

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  title,
  triggerLabel,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <>
      {/* Trigger Button (üstteki küçük pill) */}
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 20,
          backgroundColor: "rgba(35,47,70,0.08)",
          cursor: "pointer",
        }}
      >
        {selectedOption?.icon && (
          <Box sx={{ fontSize: 20 }}>{selectedOption.icon}</Box>
        )}
        <Typography fontSize={14}>
          {selectedOption?.title || triggerLabel || "Select"}
        </Typography>
      </Box>

      {/* Popover Panel */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: 380,
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <Typography sx={{ px: 2, py: 1.5, fontWeight: 600, fontSize: 18 }}>
          {title}
        </Typography>

        <List>
          {options.map((opt) => {
            const isSelected = value === opt.value;

            return (
              <ListItemButton
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setAnchorEl(null);
                }}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                }}
              >
                {/* Icon */}
                {opt.icon && <Box sx={{ fontSize: 24, mr: 2 }}>{opt.icon}</Box>}

                {/* Text */}
                <ListItemText
                  primary={
                    <Typography fontWeight={600} fontSize={15}>
                      {opt.title}
                    </Typography>
                  }
                  secondary={
                    opt.subtitle && (
                      <Typography fontSize={13} color="text.secondary">
                        {opt.subtitle}
                      </Typography>
                    )
                  }
                />

                {/* Checkmark */}
                {isSelected && <CheckIcon sx={{ color: "primary.main" }} />}
              </ListItemButton>
            );
          })}
        </List>
      </Popover>
    </>
  );
};
