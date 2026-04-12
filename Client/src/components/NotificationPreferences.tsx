import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Switch,
  Stack,
  Divider,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Bell,
  ChatCircle,
  Package,
  CalendarCheck,
  Megaphone,
  EnvelopeSimple,
} from "@phosphor-icons/react";

interface Pref {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

const initialPrefs: Pref[] = [
  {
    id: "messages",
    icon: <ChatCircle size={24} />,
    label: "Mesajlar",
    description: "Yeni mesaj aldığında bildirim al",
    email: true,
    push: true,
  },
  {
    id: "borrow",
    icon: <Package size={24} />,
    label: "Ödünç İstekleri",
    description: "Ödünç isteklerinde bildirim al",
    email: true,
    push: true,
  },
  {
    id: "events",
    icon: <CalendarCheck size={24} />,
    label: "Etkinlikler",
    description: "Yeni etkinlik ve hatırlatmalar",
    email: false,
    push: true,
  },
  {
    id: "announcements",
    icon: <Megaphone size={24} />,
    label: "Mahalle Duyuruları",
    description: "Mahallendeki duyurular",
    email: false,
    push: true,
  },
  {
    id: "comments",
    icon: <Bell size={24} />,
    label: "Yorumlar & Beğeniler",
    description: "Gönderilerine yapılan yorumlar",
    email: false,
    push: true,
  },
];

const NotificationPreferences: React.FC = () => {
  const [prefs, setPrefs] = useState<Pref[]>(initialPrefs);

  const toggle = (id: string, type: "email" | "push") => {
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [type]: !p[type] } : p)),
    );
  };

  return (
    <Card sx={{ borderRadius: 3 }} elevation={2}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            🔔 Bildirim Tercihleri
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hangi bildirimleri nasıl almak istediğini özelleştir.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ px: 1 }}>
          {/* Başlık satırı */}
          <Stack direction="row" alignItems="center" sx={{ px: 2, py: 1.5 }}>
            <Box flex={1} />
            <Stack direction="row" spacing={3}>
              <Chip
                icon={<EnvelopeSimple size={14} />}
                label="E-posta"
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<Bell size={14} />}
                label="Push"
                size="small"
                variant="outlined"
              />
            </Stack>
          </Stack>

          {prefs.map((pref, index) => (
            <React.Fragment key={pref.id}>
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  px: 2,
                  py: 2,
                  borderRadius: 2,
                  mx: 1,
                  transition: "background 0.2s",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 40,
                    height: 40,
                    mr: 2,
                  }}
                >
                  {pref.icon}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {pref.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pref.description}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Switch
                    checked={pref.email}
                    onChange={() => toggle(pref.id, "email")}
                    size="small"
                  />
                  <Switch
                    checked={pref.push}
                    onChange={() => toggle(pref.id, "push")}
                    size="small"
                    color="secondary"
                  />
                </Stack>
              </Stack>
              {index < prefs.length - 1 && <Divider sx={{ mx: 2 }} />}
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
