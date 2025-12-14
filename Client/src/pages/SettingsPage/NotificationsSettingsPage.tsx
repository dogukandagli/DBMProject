import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router";
import {
  CaretRight,
  FileText,
  EnvelopeSimple,
  WarningCircle,
  UserCircle,
  Buildings,
  ShoppingBag,
  UsersThree,
  House,
} from "@phosphor-icons/react/dist/ssr";

type Item = { label: string; to: string; icon: React.ReactNode };

export default function NotificationSettingsPage() {
  const navigate = useNavigate();

  const items: Item[] = [
    { label: "Posts", to: "/settings/notifications/posts", icon: <FileText size={22} /> },
    { label: "Digests", to: "/settings/notifications/digests", icon: <EnvelopeSimple size={22} /> },
    { label: "Real-time alerts", to: "/settings/notifications/realtime", icon: <WarningCircle size={22} /> },
    { label: "My activity", to: "/settings/notifications/activity", icon: <UserCircle size={22} /> },
    { label: "Public agencies", to: "/settings/notifications/agencies", icon: <Buildings size={22} /> },
    { label: "For Sale & Free", to: "/settings/notifications/for-sale", icon: <ShoppingBag size={22} /> },
    { label: "Groups & Contacts", to: "/settings/notifications/groups", icon: <UsersThree size={22} /> },
    { label: "Komşu promotions", to: "/settings/notifications/promotions", icon: <House size={22} /> },
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 1 }}>
      {/* Top bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton
          onClick={() => navigate("/settings")}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Typography sx={{ fontSize: 16, fontWeight: 900 }}>
          Settings
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3, borderColor: "divider", overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            {items.map((it, idx) => (
              <Box key={it.to}>
                <ListItemButton onClick={() => navigate(it.to)} sx={{ py: 1.6, px: 2 }}>
                  <ListItemIcon sx={{ minWidth: 44 }}>{it.icon}</ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 800 }}>{it.label}</Typography>}
                  />
                  <CaretRight size={22} weight="bold" />
                </ListItemButton>
                {idx !== items.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
