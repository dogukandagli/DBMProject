import { useTheme } from "@mui/material";
import type { IconProps } from "@phosphor-icons/react";
import { useState, type FC } from "react";

type IconPhosphorProps = {
  Icon: React.ComponentType<IconProps>;
  active?: boolean;
  onClick?: () => void;
  color?: string;
};

export const IconPhosphor: FC<IconPhosphorProps> = ({
  Icon,
  active = false,
  onClick,
  color,
}) => {
  const [hover, setHover] = useState(false);
  const isActive = hover || active;
  const theme = useTheme();

  const finalColor = color ?? theme.palette.icon.main;

  return (
    <Icon
      color={finalColor}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      size={28}
      weight={isActive ? "fill" : "regular"}
    />
  );
};
