import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import type { IconProps } from "@phosphor-icons/react";
import { useState, type FC } from "react";

type SidebarItemProps = {
  text: string;
  Icon: React.ComponentType<IconProps>;
  active?: boolean;
  onClick?: () => void;
};

export const SidebarItem: FC<SidebarItemProps> = ({
  text,
  Icon,
  active = false,
  onClick,
}) => {
  const [hover, setHover] = useState(false);
  const isActive = hover || active;

  const theme = useTheme();

  return (
    <ListItemButton
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        transition: "0.2s",
      }}
    >
      <ListItemIcon>
        <Icon
          size={28}
          color={theme.palette.icon.main}
          weight={isActive ? "fill" : "regular"}
        />
      </ListItemIcon>

      <ListItemText
        primary={text}
        primaryTypographyProps={{
          fontWeight: isActive ? 620 : 420,
          fontSize: 16,
        }}
      />
    </ListItemButton>
  );
};
