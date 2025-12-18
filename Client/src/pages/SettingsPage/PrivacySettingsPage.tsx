import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Switch,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type PrivacyValue =
  | "anyone"
  | "neighbors"
  | "only_me"
  | "anyone_can_mention"
  | "neighbors_can_mention"
  | "no_one_can_mention";

const OPTIONS_VISIBILITY: { value: PrivacyValue; label: string }[] = [
  { value: "anyone", label: "Komşu'daki herkes" },
  { value: "neighbors", label: "Sadece komşular" },
  { value: "only_me", label: "Sadece ben" },
];

const OPTIONS_MENTION: { value: PrivacyValue; label: string }[] = [
  { value: "anyone_can_mention", label: "Herkes benden bahsedebilir" },
  { value: "neighbors_can_mention", label: "Sadece komşular benden bahsedebilir" },
  { value: "no_one_can_mention", label: "Hiç kimse benden bahsedemez" },
];

function Row({
  title,
  description,
  value,
  options,
  onChange,
}: {
  title: string;
  description: string;
  value: PrivacyValue;
  options: { value: PrivacyValue; label: string }[];
  onChange: (v: PrivacyValue) => void;
}) {
  return (
    <Box sx={{ py: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 0.6 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1.5 }}>
        {description}
      </Typography>

      <FormControl size="small">
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value as PrivacyValue)}
          sx={{
            borderRadius: 3,
            minWidth: 220,
            "& .MuiSelect-select": { py: 1, fontWeight: 700 },
          }}
        >
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function ToggleRow({
  title,
  value,
  onChange,
}: {
  title: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.2,
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{title}</Typography>
      <Switch checked={value} onChange={(e) => onChange(e.target.checked)} />
    </Box>
  );
}

export default function PrivacySettingsPage() {
  const navigate = useNavigate();

  const initial = useMemo(
    () => ({
      fullName: "anyone" as PrivacyValue,
      photos: "anyone" as PrivacyValue,
      bio: "anyone" as PrivacyValue,
      discoverability: "anyone" as PrivacyValue,
      mention: "anyone_can_mention" as PrivacyValue,
      directMessage: "anyone" as PrivacyValue,
      syncContacts: false,
      discoverByEmail: true,
      discoverByPhone: true,
      allowMailLetters: false,
    }),
    []
  );

  const [form, setForm] = useState(initial);

  const setPrivacyField = (k: keyof typeof form, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
    console.log("BACKEND:PATCH_PRIVACY", { [k]: v });
  };

  const removeAllContacts = async () => {
    console.log("BACKEND:REMOVE_ALL_CONTACTS");
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton
          onClick={() => navigate("/settings")}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Typography
          onClick={() => navigate("/settings")}
          sx={{
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Ayarlar
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ fontSize: 20, mb: 0.5 }}>
            Profil görünürlüğü
          </Typography>

          <Typography
            onClick={() => console.log("Daha fazla bilgi")}
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "primary.main",
              cursor: "pointer",
              mb: 2,
              width: "fit-content",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Daha fazla bilgi edinin
          </Typography>

          <Divider />

          <Row
            title="Tam Ad"
            description="Tam adınızı kimlerin görebileceğini kontrol edin (Diğerleri adınızı Taner D. şeklinde görecektir)."
            value={form.fullName}
            options={OPTIONS_VISIBILITY}
            onChange={(v) => setPrivacyField("fullName", v)}
          />
          <Divider />

          <Row
            title="Profil ve kapak fotoğrafları"
            description="Profil fotoğrafınızı ve kapak fotoğrafınızı kimlerin görebileceğini kontrol edin."
            value={form.photos}
            options={OPTIONS_VISIBILITY}
            onChange={(v) => setPrivacyField("photos", v)}
          />
          <Divider />

          <Row
            title="Profil"
            description="Hakkınızda kısmını kimlerin görebileceğini kontrol edin."
            value={form.bio}
            options={OPTIONS_VISIBILITY}
            onChange={(v) => setPrivacyField("bio", v)}
          />
          <Divider />

          <Row
            title="Bulunabilirlik"
            description="Sizi kimlerin aratabileceğini kontrol edin."
            value={form.discoverability}
            options={OPTIONS_VISIBILITY}
            onChange={(v) => setPrivacyField("discoverability", v)}
          />
          <Divider />

          <Row
            title="Bahsetme"
            description="Diğer üyelerin sizden bahsedip bahsedemeyeceğini veya etiketleyip etiketleyemeyeceğini kontrol edin."
            value={form.mention}
            options={OPTIONS_MENTION}
            onChange={(v) => setPrivacyField("mention", v)}
          />
          <Divider />

          <Row
            title="Doğrudan mesaj"
            description="Size kimlerin doğrudan mesaj gönderebileceğini kontrol edin."
            value={form.directMessage}
            options={OPTIONS_VISIBILITY}
            onChange={(v) => setPrivacyField("directMessage", v)}
          />
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ fontSize: 18, mb: 2 }}>
            Kişiler
          </Typography>

          <ToggleRow
            title="Rehberdeki kişileri senkronize et"
            value={form.syncContacts}
            onChange={(v) => setPrivacyField("syncContacts", v)}
          />
          <ToggleRow
            title="Başkalarının sizi e-posta ile bulmasına izin verin"
            value={form.discoverByEmail}
            onChange={(v) => setPrivacyField("discoverByEmail", v)}
          />
          <ToggleRow
            title="Başkalarının sizi telefon numarası ile bulmasına izin verin"
            value={form.discoverByPhone}
            onChange={(v) => setPrivacyField("discoverByPhone", v)}
          />

          <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 1.5 }}>
            Rehberinizdeki kişiler düzenli olarak senkronize edilecektir...{" "}
            <Box
              component="span"
              onClick={() => console.log("Kişiler hakkında bilgi")}
              sx={{ color: "primary.main", cursor: "pointer", fontWeight: 700 }}
            >
              Daha fazla bilgi edinin
            </Box>
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              disableElevation
              onClick={removeAllContacts}
              sx={{ px: 2.5, fontWeight: 800 }}
            >
              Tüm kişileri kaldır
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ fontSize: 18, mb: 2 }}>
            Davet Mektupları
          </Typography>

          <ToggleRow
            title="Komşu'nun adınıza mektup göndermesine izin verin"
            value={form.allowMailLetters}
            onChange={(v) => setPrivacyField("allowMailLetters", v)}
          />

          <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 1 }}>
            Davetler, henüz Komşu'da olmayan yakın komşulara gönderilir.
          </Typography>

          <Box component="ul" sx={{ m: 0, pl: 2.2, mt: 1.2, color: "text.primary" }}>
            <li><Typography sx={{ fontSize: 13 }}>Adınız</Typography></li>
            <li><Typography sx={{ fontSize: 13 }}>Sokak adınız</Typography></li>
            <li><Typography sx={{ fontSize: 13 }}>Komşu hakkında yararlı bilgiler</Typography></li>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ fontSize: 18, mb: 1.5 }}>
            Uygulamalar
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 1.5 }}>
            Diğer uygulamalarla paylaşım
          </Typography>
          <Button variant="contained" disableElevation sx={{ px: 2.5, fontWeight: 800 }}>
            Düzenle
          </Button>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ fontSize: 18, mb: 1 }}>
            Engellenen hesaplar
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
            Size mesaj gönderemeyecek veya profilinizi bulamayacak kişileri kontrol edin.
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
            Engellenmiş hesap yok
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ fontSize: 18, mb: 1 }}>
            Sessize alınanlar
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
            Artık görmek istemediğiniz hesapları veya konuları kontrol edin.
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
            Sessize alınan bir şey yok
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}