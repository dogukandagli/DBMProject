import { Box } from "@mui/material";
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

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      sx={{
        backgroundColor: "#F0F2F5",
        borderRadius: "50%",
        p: 0.6,
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <Icon size={30} color="#232F46" weight={isActive ? "fill" : "regular"} />
    </Box>
  );
};
