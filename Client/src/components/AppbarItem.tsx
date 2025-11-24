import { Box, useTheme } from "@mui/material";
import type { IconProps } from "@phosphor-icons/react";
import { useState, type FC } from "react";

type AppbarItemProps = {
  Icon: React.ComponentType<IconProps>;
  active?: boolean;
  onClick?: () => void;
};

export const AppbarItem: FC<AppbarItemProps> = ({
  Icon,
  active = false,
  onClick,
}) => {
  const [hover, setHover] = useState(false);
  const isActive = hover || active;
  const theme = useTheme();

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      sx={(theme) => ({
        backgroundColor: theme.palette.icon.background,
        borderRadius: "50%",
        p: 0.6,
        cursor: "pointer",
      })}
    >
      <Icon
        size={30}
        color={theme.palette.icon.main}
        weight={isActive ? "fill" : "regular"}
      />
    </Box>
  );
};
