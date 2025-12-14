import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { logout } from "../../features/auth/store/AuthSlice";
import { ArrowSquareOut, SignOut } from "@phosphor-icons/react/dist/ssr";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router";



export default function AccountSettingsPage() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((s) => s.auth);

    // initial values (backend bağlayınca user içinden çekersin)
    const initial = useMemo(
        () => ({
            firstName: (user as any)?.firstName ?? "Taner",
            lastName: (user as any)?.lastName ?? "Derin",
            email: (user as any)?.email ?? "derintaner2003@gmail.com",
            twoFA: "email",
            language: "en-US",
        }),
        [user]
    );

    const [form, setForm] = useState(initial);
    const [dirty, setDirty] = useState(false);

    const setField = (k: keyof typeof form, v: any) => {
        setForm((p) => ({ ...p, [k]: v }));
        setDirty(true);
    };

    // =========================
    // BACKEND HOOKS (işaretli)
    // =========================

    const handleSave = async () => {
        // BACKEND: PUT/PATCH /account (firstName,lastName,email,twoFA,language)
        // await apiClient.put("/account", form);
        console.log("BACKEND:SAVE ->", form);

        setDirty(false);
    };

    const handleRequestMyInfo = async () => {
        // BACKEND: POST /account/export (veya /gdpr/export) -> export job başlat
        // await apiClient.post("/account/export");
        console.log("BACKEND:REQUEST_MY_INFO");
    };

    const handleLogout = async () => {
        // BACKEND: POST /auth/logout (opsiyonel) + store temizle
        // await apiClient.post("/auth/logout");
        dispatch(logout({}));
    };

    const handleDeactivate = async () => {
        // BACKEND: POST /account/deactivate
        // await apiClient.post("/account/deactivate");
        console.log("BACKEND:DEACTIVATE_ACCOUNT");
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
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

                <Typography
                    onClick={() => navigate("/settings")}
                    sx={{
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: "pointer",
                        color: "text.primary",
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    Settings
                </Typography>
            </Box>




            <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 2 }}>
                Your account
            </Typography>

            {/* ====== MAIN CARD (form) ====== */}
            <Card
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    borderColor: "divider",
                    overflow: "hidden",
                    mb: 2.5,
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    {/* Full name */}
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
                        Full name
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                            label="First name"
                            value={form.firstName}
                            onChange={(e) => setField("firstName", e.target.value)}
                            fullWidth
                            sx={{ flex: 1, minWidth: 260 }}
                        />
                        <TextField
                            label="Last name"
                            value={form.lastName}
                            onChange={(e) => setField("lastName", e.target.value)}
                            fullWidth
                            sx={{ flex: 1, minWidth: 260 }}
                        />
                    </Box>

                    <Typography sx={{ mt: 1, fontSize: 13, color: "text.secondary" }}>
                        Neighbors use their real names on Komşu.{" "}
                        <Box
                            component="span"
                            sx={{
                                color: theme.palette.primary.main,
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                            onClick={() => {
                                // BACKEND: gerek yok (info sayfası / docs link)
                            }}
                        >
                            Learn more
                        </Box>
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    {/* Email */}
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
                        Email
                    </Typography>
                    <TextField
                        label="Email address"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        fullWidth
                    />

                    <Divider sx={{ my: 3 }} />

                    {/* Password */}
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
                        Password
                    </Typography>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            borderRadius: 999,
                            textTransform: "none",
                            fontWeight: 700,
                            px: 2.5,
                        }}
                        onClick={() => {
                            // BACKEND: Change password akışı (modal + endpoint)
                            // await apiClient.post("/account/change-password", ...)
                            console.log("BACKEND:CHANGE_PASSWORD (later)");
                        }}
                    >
                        Change password
                    </Button>

                    <Divider sx={{ my: 3 }} />

                    {/* Mobile number */}
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
                        Mobile number
                    </Typography>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            borderRadius: 999,
                            textTransform: "none",
                            fontWeight: 700,
                            px: 2.5,
                        }}
                        onClick={() => {
                            // BACKEND: Add mobile number flow (later)
                            console.log("BACKEND:ADD_MOBILE (later)");
                        }}
                    >
                        Add mobile number
                    </Button>

                    <Divider sx={{ my: 3 }} />

                    {/* 2FA */}
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
                        2FA preference
                    </Typography>
                    <FormControl sx={{ minWidth: 220 }}>
                        <InputLabel id="twofa-label">2FA</InputLabel>
                        <Select
                            labelId="twofa-label"
                            label="2FA"
                            value={form.twoFA}
                            onChange={(e) => setField("twoFA", e.target.value)}
                            sx={{ borderRadius: 3 }}
                        >
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="sms">SMS (later)</MenuItem>
                            <MenuItem value="app">Authenticator app (later)</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider sx={{ my: 3 }} />

                    {/* Language */}
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
                        Language
                    </Typography>
                    <FormControl sx={{ minWidth: 220 }}>
                        <InputLabel id="lang-label">Language</InputLabel>
                        <Select
                            labelId="lang-label"
                            label="Language"
                            value={form.language}
                            onChange={(e) => setField("language", e.target.value)}
                            sx={{ borderRadius: 3 }}
                        >
                            <MenuItem value="tr-TR">Türkçe (TR)</MenuItem>
                            <MenuItem value="en-US">English (US)</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Save */}
                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            disableElevation
                            disabled={!dirty}
                            sx={{
                                borderRadius: 999,
                                textTransform: "none",
                                fontWeight: 800,
                                px: 3,
                                opacity: dirty ? 1 : 0.4,
                            }}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* ====== Download your information ====== */}
            <Card
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    borderColor: "divider",
                    overflow: "hidden",
                    mb: 2.5,
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 800, mb: 1 }}>
                        Download your information
                    </Typography>

                    <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2 }}>
                        You can download a copy of all your information on Komşu. This includes
                    </Typography>

                    <Box component="ul" sx={{ m: 0, pl: 2.2, color: "text.primary" }}>
                        <li>
                            <Typography sx={{ fontSize: 14 }}>
                                Posts, replies, and other content you've created
                            </Typography>
                        </li>
                        <li>
                            <Typography sx={{ fontSize: 14 }}>
                                Account information, like email preferences and profile details
                            </Typography>
                        </li>
                        <li>
                            <Typography sx={{ fontSize: 14 }}>
                                Information about your activity, like the device types and app versions you've used
                            </Typography>
                        </li>
                    </Box>

                    <Box sx={{ mt: 2.5 }}>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                borderRadius: 999,
                                textTransform: "none",
                                fontWeight: 800,
                                px: 2.5,
                            }}
                            onClick={handleRequestMyInfo}
                        >
                            Request my information
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* ====== Bottom row: Log out + Deactivate ====== */}
            <Card
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    borderColor: "divider",
                    overflow: "hidden",
                }}
            >
                <CardContent
                    sx={{
                        p: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<SignOut size={18} />}
                        sx={{
                            borderRadius: 999,
                            textTransform: "none",
                            fontWeight: 800,
                            px: 2.5,
                        }}
                        onClick={handleLogout}
                    >
                        Log out
                    </Button>

                    <Box
                        onClick={handleDeactivate}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            color: theme.palette.primary.main,
                            fontWeight: 800,
                        }}
                    >
                        <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
                            Deactivate your account
                        </Typography>
                        <ArrowSquareOut size={18} />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
