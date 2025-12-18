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
import { User as UserIcon, Lock, Bell, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { logout } from "../../features/auth/store/AuthSlice";

type Row = {
  label: string;
  icon: React.ReactNode;
  rightText?: string;
  to?: string;
  onClick?: () => void;
};

export default function SettingsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status: authStatus } = useAppSelector((s) => s.auth);

  const isLoggingOut = authStatus === "pendingLogout";

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      await dispatch(logout({})).unwrap();
    } finally {
      window.location.href = "/login";
    }
  };

  const rows: Row[] = [
    {
      label: "Hesap ayarları",
      icon: <UserIcon size={22} />,
      to: "/settings/account",
    },
    {
      label: "Gizlilik ayarları",
      icon: <Lock size={22} />,
      to: "/settings/privacy",
    },
    {
      label: "Bildirim ayarları",
      icon: <Bell size={22} />,
      to: "/settings/notifications",
    },
    {
      label: "Mahalleler",
      icon: <UsersThree size={22} />,
      to: "/settings/neighborhoods",
    },
  ];

  const bottomLinks: Row[] = [
    { label: "Gizlilik politikası", icon: <></>, to: "/privacy" },
    { label: "Üye sözleşmesi", icon: <></>, to: "/member-agreement" },
    { label: isLoggingOut ? "Çıkış yapılıyor..." : "Çıkış yap", icon: <></>, onClick: handleLogout },
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 1 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 2 }}>
        Ayarlar
      </Typography>

      <List sx={{ p: 0, borderRadius: 2, overflow: "hidden" }}>
        {rows.map((r, idx) => (
          <Box key={r.label}>
            <ListItemButton
              onClick={() => {
                if (r.onClick) return r.onClick();
                if (r.to) navigate(r.to);
              }}
              sx={{ py: 2, px: 1.5 }}
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
            onClick={() => {
              if (b.onClick) return b.onClick();
              if (b.to) navigate(b.to);
            }}
            sx={{
              fontSize: 15,
              fontWeight: 600,
              py: 1.2,
              cursor: isLoggingOut && b.onClick ? "default" : "pointer",
              color: "text.primary",
              opacity: isLoggingOut && b.onClick ? 0.6 : 1,
              pointerEvents: isLoggingOut && b.onClick ? "none" : "auto",
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
