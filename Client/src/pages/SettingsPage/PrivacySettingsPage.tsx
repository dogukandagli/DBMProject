import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Typography,
  IconButton,
  useTheme,
  Switch,
  Button,
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
  { value: "anyone", label: "Anyone on Komşu" },
  { value: "neighbors", label: "Neighbors only" },
  { value: "only_me", label: "Only me" },
];

const OPTIONS_MENTION: { value: PrivacyValue; label: string }[] = [
  { value: "anyone_can_mention", label: "Anyone can mention me" },
  { value: "neighbors_can_mention", label: "Neighbors can mention me" },
  { value: "no_one_can_mention", label: "No one can mention me" },
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
            borderRadius: 999,
            px: 0.5,
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
  const theme = useTheme();
  const navigate = useNavigate();

  const initial = useMemo(
    () => ({
      // profile visibility
      fullName: "anyone" as PrivacyValue,
      photos: "anyone" as PrivacyValue,
      bio: "anyone" as PrivacyValue,
      discoverability: "anyone" as PrivacyValue,
      mention: "anyone_can_mention" as PrivacyValue,
      directMessage: "anyone" as PrivacyValue,

      // contacts toggles
      syncContacts: false,
      discoverByEmail: true,
      discoverByPhone: true,

      // invitation letters
      allowMailLetters: false,
    }),
    []
  );

  const [form, setForm] = useState(initial);

  const setPrivacyField = (k: keyof typeof form, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));

    // BACKEND: her değişiklikte otomatik patch istersen:
    // await apiClient.patch("/settings/privacy", { [k]: v });
    console.log("BACKEND:PATCH_PRIVACY", { [k]: v });
  };

  const removeAllContacts = async () => {
    // BACKEND: DELETE /contacts (veya /settings/contacts/remove-all)
    // await apiClient.delete("/contacts");
    console.log("BACKEND:REMOVE_ALL_CONTACTS");
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 1 }}>
      {/* Top bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton
          onClick={() => navigate("/settings")}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Typography sx={{ fontSize: 16, fontWeight: 900 }}>
          Settings
        </Typography>
      </Box>

      {/* ===== Profile visibility ===== */}
      <Card
        variant="outlined"
        sx={{ borderRadius: 3, borderColor: "divider", overflow: "hidden", mb: 2.5 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 900, mb: 0.5 }}>
            Profile visibility
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.palette.primary.main,
              cursor: "pointer",
              mb: 2,
              width: "fit-content",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => {
              // BACKEND: gerek yok - docs link
              console.log("Learn more");
            }}
          >
            Learn more
          </Typography>

          <Divider />

          <Row
            title="Full Name"
            description="Control who sees your full name (All others will view your name as Taner D.)."
            value={form.fullName}
            options={OPTIONS_VISIBILITY}
            onChange={(v) => setPrivacyField("fullName", v)}
          />
          <Divider />

          <Row
            title="Profile and cover photos"
            description="Control who sees your profile photo and cover photo."
            value={form.photos}
            options={OPTIONS_VISIBILITY}
            onChange={(v) => setPrivacyField("photos", v)}
          />
          <Divider />

          <Row
            title="Profile"
            description="Control who sees your bio."
            value={form.bio}
            options={OPTIONS_VISIBILITY}
            onChange={(v) => setPrivacyField("bio", v)}
          />
          <Divider />

          <Row
            title="Discoverability"
            description="Control who can search for you."
            value={form.discoverability}
            options={OPTIONS_VISIBILITY}
            onChange={(v) => setPrivacyField("discoverability", v)}
          />
          <Divider />

          <Row
            title="Mention"
            description="Control whether other members can mention or tag you."
            value={form.mention}
            options={OPTIONS_MENTION}
            onChange={(v) => setPrivacyField("mention", v)}
          />
          <Divider />

          <Row
            title="Direct message"
            description="Control who can message you directly. You may still receive messages through For Sale & Free or the Help Map."
            value={form.directMessage}
            options={OPTIONS_VISIBILITY}
            onChange={(v) => setPrivacyField("directMessage", v)}
          />
        </CardContent>
      </Card>

      {/* ===== Contacts ===== */}
      <Card
        variant="outlined"
        sx={{ borderRadius: 3, borderColor: "divider", overflow: "hidden", mb: 2.5 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 900, mb: 2 }}>
            Contacts
          </Typography>

          <ToggleRow
            title="Sync address book contacts"
            value={form.syncContacts}
            onChange={(v) => {
              setPrivacyField("syncContacts", v);
              // BACKEND: sync aç/kapat
              // await apiClient.post("/contacts/sync", { enabled: v });
            }}
          />

          <ToggleRow
            title="Let others discover you by email"
            value={form.discoverByEmail}
            onChange={(v) => {
              setPrivacyField("discoverByEmail", v);
              // BACKEND: patch discoverability email
              // await apiClient.patch("/settings/privacy", { discoverByEmail: v });
            }}
          />

          <ToggleRow
            title="Let others discover you by phone"
            value={form.discoverByPhone}
            onChange={(v) => {
              setPrivacyField("discoverByPhone", v);
              // BACKEND: patch discoverability phone
            }}
          />

          <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 1.5 }}>
            Contacts from your address book will be synced regularly to help connect you with your
            friends and personalize your experience. Turning off syncing will not remove previously
            uploaded contacts.{" "}
            <Box
              component="span"
              sx={{
                color: theme.palette.primary.main,
                cursor: "pointer",
                fontWeight: 700,
              }}
              onClick={() => {
                // BACKEND: gerek yok - docs link
                console.log("Learn more contacts");
              }}
            >
              Learn more
            </Box>
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 900,
                px: 2.5,
              }}
              onClick={removeAllContacts}
            >
              Remove all contacts
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ===== Invitation Letters ===== */}
      <Card
        variant="outlined"
        sx={{ borderRadius: 3, borderColor: "divider", overflow: "hidden", mb: 2.5 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 900, mb: 2 }}>
            Invitation Letters
          </Typography>

          <ToggleRow
            title="Allow Komşu to mail letters on your behalf"
            value={form.allowMailLetters}
            onChange={(v) => {
              setPrivacyField("allowMailLetters", v);
              // BACKEND: toggle letters
              // await apiClient.patch("/settings/privacy", { allowMailLetters: v });
            }}
          />

          <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 1 }}>
            Invitations are sent to nearby neighbors who aren't already on Komşu. Letters include
          </Typography>

          <Box component="ul" sx={{ m: 0, pl: 2.2, mt: 1.2 }}>
            <li>
              <Typography sx={{ fontSize: 13 }}>Your name</Typography>
            </li>
            <li>
              <Typography sx={{ fontSize: 13 }}>Your street name</Typography>
            </li>
            <li>
              <Typography sx={{ fontSize: 13 }}>Helpful information about Komşu</Typography>
            </li>
          </Box>
        </CardContent>
      </Card>

      {/* ===== Apps ===== */}
      <Card
        variant="outlined"
        sx={{ borderRadius: 3, borderColor: "divider", overflow: "hidden", mb: 2.5 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 900, mb: 1.5 }}>
            Apps
          </Typography>

          <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 1 }}>
            Sharing across other apps
          </Typography>

          <Button
            variant="contained"
            disableElevation
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 900,
              px: 2.5,
            }}
            onClick={() => {
              // BACKEND: apps sharing edit ekranı/endpoint
              console.log("BACKEND:EDIT_APP_SHARING (later)");
            }}
          >
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* ===== Blocked accounts ===== */}
      <Card
        variant="outlined"
        sx={{ borderRadius: 3, borderColor: "divider", overflow: "hidden", mb: 2.5 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 900, mb: 1 }}>
            Blocked accounts
          </Typography>

          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
            Control who cannot message you or find your profile and content on Komşu.
          </Typography>

          <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
            No accounts blocked
          </Typography>

          {/* BACKEND: GET /blocks -> liste dolarsa burada render edeceksin */}
        </CardContent>
      </Card>

      {/* ===== Muted (en altta) ===== */}
      <Card
        variant="outlined"
        sx={{ borderRadius: 3, borderColor: "divider", overflow: "hidden" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 900, mb: 1 }}>
            Muted
          </Typography>

          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
            Control accounts or topics you no longer want to see.
          </Typography>

          <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
            Nothing muted
          </Typography>

          {/* BACKEND: GET /mutes -> liste dolarsa burada render edeceksin */}
        </CardContent>
      </Card>
    </Box>
  );
}
