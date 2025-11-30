import { Tooltip, useTheme, type TooltipProps } from "@mui/material";
import type { FC, ReactElement } from "react";

type AppTooltipProps = {
  title: string;
  children: ReactElement;
  placement?: TooltipProps["placement"];
  arrow?: boolean;
  disabled?: boolean;
};

export const AppTooltip: FC<AppTooltipProps> = ({
  title,
  children,
  placement = "bottom",
  arrow = true,
  disabled = false,
}) => {
  if (disabled) return children;

  const theme = useTheme();
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: `${theme.palette.accent.background}`,
            color: `${theme.palette.accent.main}`,
            fontSize: 15,
            paddingX: 2,
            paddingY: 1,
            borderRadius: 2,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
          },
        },
        arrow: {
          sx: {
            color: `${theme.palette.accent.background}`,
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};
