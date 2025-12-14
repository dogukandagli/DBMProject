import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import {
  User as UserIcon,
  Lock,
  Bell,
  UsersThree,
  Moon,
} from "@phosphor-icons/react/dist/ssr";
import { useNavigate } from "react-router";

type Row = {
  label: string;
  icon: React.ReactNode;
  rightText?: string;
  to?: string; // şimdilik route, sonra sayfaları açarız
  onClick?: () => void;
};

export default function SettingsPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const rows: Row[] = [
    {
      label: "Account settings",
      icon: <UserIcon size={22} />,
      to: "/settings/account",
    },
    {
      label: "Privacy settings",
      icon: <Lock size={22} />,
      to: "/settings/privacy",
    },
    {
      label: "Notification settings",
      icon: <Bell size={22} />,
      to: "/settings/notifications",
    },
    {
      label: "Neighborhoods",
      icon: <UsersThree size={22} />,
      to: "/settings/neighborhoods",
    },
    {
      label: "Appearance",
      icon: <Moon size={22} />,
      rightText: "Light Mode",
      to: "/settings/appearance",
    },
  ];

  const bottomLinks: Row[] = [
    { label: "Privacy policy", icon: <></>, to: "/privacy" },
    { label: "Member agreement", icon: <></>, to: "/member-agreement" },
    { label: "Log out", icon: <></>, to: "/logout" }, // bunu sonra gerçek logout'a bağlarız
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 1 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 2 }}>
        Settings
      </Typography>

      <List sx={{ p: 0, borderRadius: 2, overflow: "hidden" }}>
        {rows.map((r, idx) => (
          <Box key={r.label}>
            <ListItemButton
              onClick={() => {
                if (r.onClick) return r.onClick();
                if (r.to) navigate(r.to);
              }}
              sx={{
                py: 2,
                px: 1.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 44, color: theme.palette.text.primary }}>
                {r.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                      {r.label}
                    </Typography>
                    {r.rightText && (
                      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                        · {r.rightText}
                      </Typography>
                    )}
                  </Box>
                }
              />

              <CaretRight size={22} weight="bold" />
            </ListItemButton>

            {idx !== rows.length - 1 && <Divider />}
          </Box>
        ))}
      </List>

      <Box sx={{ mt: 3 }}>
        {bottomLinks.map((b) => (
          <Typography
            key={b.label}
            onClick={() => b.to && navigate(b.to)}
            sx={{
              fontSize: 15,
              fontWeight: 600,
              py: 1.2,
              cursor: "pointer",
              color: "text.primary",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {b.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
