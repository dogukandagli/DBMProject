import { useTheme } from "@mui/material";
import type { IconProps } from "@phosphor-icons/react";
import { useState, type FC } from "react";

type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

type IconPhosphorProps = {
  Icon: React.ComponentType<IconProps>;
  active?: boolean;
  onClick?: () => void;
  color?: string;
  weight?: IconWeight;
  finalSize?: number;
};

export const IconPhosphor: FC<IconPhosphorProps> = ({
  Icon,
  active = false,
  onClick,
  color,
  weight = "regular",
  finalSize = 28,
}) => {
  const [hover, setHover] = useState(false);
  const theme = useTheme();

  const finalColor = color ?? theme.palette.icon.main;
  const finalWeight: IconWeight = active || hover ? "fill" : weight;

  return (
    <Icon
      color={finalColor}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      size={finalSize}
      weight={finalWeight}
    />
  );
};
