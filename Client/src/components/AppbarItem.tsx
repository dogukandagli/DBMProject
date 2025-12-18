import { Badge, IconButton, useTheme } from "@mui/material";
import type { IconProps } from "@phosphor-icons/react";
import { useState, type FC } from "react";

type AppbarItemProps = {
  Icon: React.ComponentType<IconProps>;
  active?: boolean;
  onClick?: () => void;
  badgeCount?: number;
};

export const AppbarItem: FC<AppbarItemProps> = ({
  Icon,
  active = false,
  onClick,
  badgeCount = 0,
}) => {
  const [hover, setHover] = useState(false);
  const isActive = hover || active;
  const theme = useTheme();

  return (
    <>
      <IconButton
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
        sx={(theme) => ({
          backgroundColor: { md: theme.palette.icon.background },
          p: { xs: 0.5, md: 1 },
          cursor: "pointer",
          position: "relative",
        })}
      >
        <Badge
          badgeContent={badgeCount}
          color="error"
          max={99}
          invisible={badgeCount === 0}
        >
          <Icon
            size={30}
            color={theme.palette.icon.main}
            weight={isActive ? "fill" : "regular"}
          />
        </Badge>
      </IconButton>
    </>
  );
};
