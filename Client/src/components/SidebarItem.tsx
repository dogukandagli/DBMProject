import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
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
          color={"#232F46"}
          weight={isActive ? "fill" : "regular"}
        />
      </ListItemIcon>

      <ListItemText
        primary={text}
        primaryTypographyProps={{
          fontWeight: isActive ? 620 : 420,
          fontSize: 16,
          color: "#232F46",
        }}
      />
    </ListItemButton>
  );
};
