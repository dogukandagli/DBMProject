import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { logout, changePassword } from "../../features/auth/store/AuthSlice";
import { ArrowSquareOut, SignOut } from "@phosphor-icons/react/dist/ssr";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router";
import {
  updateInfo,
  requestMyInformation,
  deactivateAccount,
} from "../../features/users/store/UserSlice";

export default function AccountSettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, status: authStatus } = useAppSelector((s) => s.auth);
  const { status: userStatus } = useAppSelector((s) => s.user);

  const initial = useMemo(
    () => ({
      firstName: (user as any)?.firstName ?? "",
      lastName: (user as any)?.lastName ?? "",
      email: (user as any)?.email ?? "",
      twoFA: "email",
      language: "tr-TR",
    }),
    [user]
  );

  const [form, setForm] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const [pw, setPw] = useState({
    current: "",
    next: "",
    confirm: "",
    stayLoggedInOtherDevices: true,
  });

  const [pwErr, setPwErr] = useState<any>({});

  const [exportSel, setExportSel] = useState({
    profileInfo: true,
    posts: true,
    comments: false,
    reactions: false,
    memberships: false,
  });

  const exportAnySelected = Object.values(exportSel).some((v) => v);

  useEffect(() => {
    setForm(initial);
    setDirty(false);
  }, [initial]);

  const setField = (k: keyof typeof form, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
    setDirty(true);
  };

  const isDeactivating = userStatus === "pendingDeactivate";
  const isSaving = userStatus === "pendingUpdateInfo";
  const isRequesting = userStatus === "pendingRequestInfo";
  const isChangingPw = authStatus === "pendingChangePassword";

  const handleSave = async () => {
    if (isSaving || !dirty) return;
    const formData = new FormData();
    formData.append(
      "firstName",
      form.firstName?.trim() || (user as any)?.firstName || ""
    );
    formData.append(
      "lastName",
      form.lastName?.trim() || (user as any)?.lastName || ""
    );
    formData.append("biography", (user as any)?.biography || "");
    dispatch(updateInfo(formData));
  };

  const handleRequestMyInfo = async () => {
    if (isRequesting || !exportAnySelected) return;
    const formData = new FormData();
    formData.append("profileInfo", String(exportSel.profileInfo));
    formData.append("posts", String(exportSel.posts));
    formData.append("comments", "false");
    formData.append("reactions", "false");
    formData.append("memberships", "false");

    dispatch(requestMyInformation(formData));
    setExportOpen(false);
  };

  const handleDeactivate = async () => {
    if (isDeactivating) return;

    if (
      window.confirm(
        "Hesabınızı devre dışı bırakmak istediğinize emin misiniz? Bu işlem geri alınamaz."
      )
    ) {
      try {
        await dispatch(deactivateAccount()).unwrap();
        dispatch(logout({}));
        window.location.href = "/login";
      } catch (e) {
        console.error("İşlem başarısız:", e);
      }
    }
  };

  const submitPw = async () => {
    setPwErr({});
    if (pw.next !== pw.confirm) {
      setPwErr({ confirm: "Şifreler eşleşmiyor." });
      return;
    }
    try {
      await dispatch(
        changePassword({
          currentPassword: pw.current,
          newPassword: pw.next,
        })
      ).unwrap();
      setPwOpen(false);
    } catch (e: any) {
      const msg =
        e?.errorMessages?.join?.(" | ") || e?.data || e?.message || "";
      if (msg.toLowerCase().includes("incorrect")) {
        setPwErr({ current: "Mevcut şifre yanlış." });
      } else {
        setPwErr({ general: "Şifre güncelleme başarısız oldu." });
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
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

      <Typography variant="h3" sx={{ mb: 2 }}>
        Hesabınız
      </Typography>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
            Tam adınız
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <TextField
              label="Ad"
              value={form.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              fullWidth
              sx={{ flex: 1, minWidth: 260 }}
            />
            <TextField
              label="Soyad"
              value={form.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              fullWidth
              sx={{ flex: 1, minWidth: 260 }}
            />
          </Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 3 }}>
            Komşular, Komşu üzerinde gerçek isimlerini kullanırlar.{" "}
            <Box
              component="span"
              sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }}
            >
              Daha fazla bilgi edinin
            </Box>
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
            Şifre
          </Typography>
          <Button
            variant="contained"
            disableElevation
            onClick={() => setPwOpen(true)}
          >
            Şifreyi değiştir
          </Button>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              disableElevation
              disabled={!dirty || isSaving}
              onClick={handleSave}
              sx={{ px: 4, fontWeight: 800 }}
            >
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2.5 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ fontSize: 18, mb: 1 }}>
            Bilgilerinizi indirin
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2 }}>
            Komşu üzerindeki tüm bilgilerinizin bir kopyasını indirebilirsiniz.
          </Typography>
          <Button
            variant="contained"
            disableElevation
            disabled={isRequesting}
            onClick={() => setExportOpen(true)}
          >
            {isRequesting ? "Talep ediliyor..." : "Bilgilerimi talep et"}
          </Button>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            disableElevation
            startIcon={<SignOut size={18} />}
            onClick={() => dispatch(logout({}))}
          >
            Çıkış yap
          </Button>
          <Box
            onClick={handleDeactivate}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: isDeactivating ? "default" : "pointer",
              color: "primary.main",
              fontWeight: 800,
              opacity: isDeactivating ? 0.6 : 1,
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
              {isDeactivating
                ? "Devre dışı bırakılıyor..."
                : "Hesabınızı devre dışı bırakın"}
            </Typography>
            <ArrowSquareOut size={18} />
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={exportOpen}
        onClose={() => !isRequesting && setExportOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Bilgilerimi talep et</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Typography sx={{ color: "text.secondary", mb: 2 }}>
            Şimdilik sadece profil bilgileri ve gönderiler dışa aktarılabiliyor.
          </Typography>
          {Object.entries(exportSel).map(([key]) => (
            <Box
              key={key}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
            >
              <input
                type="checkbox"
                checked={(exportSel as any)[key]}
                onChange={(e) =>
                  setExportSel((p) => ({ ...p, [key]: e.target.checked }))
                }
              />
              <Typography sx={{ fontSize: 14 }}>
                {key === "profileInfo"
                  ? "Profil Bilgileri"
                  : key === "posts"
                  ? "Gönderiler"
                  : key === "comments"
                  ? "Yorumlar"
                  : key === "reactions"
                  ? "Etkileşimler"
                  : "Üyelikler"}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setExportOpen(false)} disabled={isRequesting}>
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleRequestMyInfo}
            disabled={isRequesting || !exportAnySelected}
          >
            {isRequesting ? "Talep ediliyor..." : "İndir"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={pwOpen}
        onClose={() => !isChangingPw && setPwOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Şifreyi değiştir</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, mb: 2 }}>
            Yeni bir şifre belirleyin
          </Typography>
          <TextField
            label="Mevcut şifre"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={pw.current}
            error={!!pwErr.current}
            helperText={pwErr.current}
            onChange={(e) => setPw({ ...pw, current: e.target.value })}
          />
          <TextField
            label="Yeni şifre"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={pw.next}
            error={!!pwErr.next}
            helperText={pwErr.next}
            onChange={(e) => setPw({ ...pw, next: e.target.value })}
          />
          <TextField
            label="Şifreyi onayla"
            type="password"
            fullWidth
            sx={{ mb: 1 }}
            value={pw.confirm}
            error={!!pwErr.confirm}
            helperText={pwErr.confirm}
            onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
          />
          {pwErr.general && (
            <Typography color="error" variant="caption">
              {pwErr.general}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={submitPw}
            disabled={isChangingPw}
          >
            {isChangingPw ? "Kaydediliyor..." : "Yeni şifreyi ayarla"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
