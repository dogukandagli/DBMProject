// SearchBar.tsx
import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "@mui/material";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) onSearch();
  };

  const theme = useTheme();

  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.();
      }}
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        borderRadius: 999, // oval görünüm
        boxShadow: "0 0 0 1px #afb7c4ff", // ince border gibi
        maxWidth: 400,
        width: "100%",
      }}
    >
      <IconButton sx={{ mr: 0.5 }}>
        <MagnifyingGlass
          size={25}
          color={theme.palette.icon.main}
          weight="bold"
        />
      </IconButton>

      <InputBase
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Bir şeyler arayın...."
        sx={{
          fontSize: 14,
          "&::placeholder": {
            color: "#5e6472ff",
            opacity: 1,
          },
        }}
      />
    </Paper>
  );
};
