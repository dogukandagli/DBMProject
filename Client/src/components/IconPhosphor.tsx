import type { IconProps } from "@phosphor-icons/react";
import { useState, type FC } from "react";

type IconPhosphorProps = {
  Icon: React.ComponentType<IconProps>;
  active?: boolean;
  onClick?: () => void;
};

export const IconPhosphor: FC<IconPhosphorProps> = ({
  Icon,
  active = false,
  onClick,
}) => {
  const [hover, setHover] = useState(false);
  const isActive = hover || active;

  return (
    <Icon
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      size={28}
      weight={isActive ? "fill" : "regular"}
    />
  );
};
