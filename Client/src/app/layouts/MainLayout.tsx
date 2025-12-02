import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  List,
  Popover,
  Toolbar,
  Typography,
  useTheme,
  ListItem,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
import {
  BellSimple,
  CalendarCheck,
  ChatsCircle,
  Handshake,
  House,
  ShoppingBag,
  SignOut,
  User,
} from "@phosphor-icons/react/dist/ssr";
import { SearchBar } from "../../components/SearchBar";
import { useState } from "react";
import { SidebarItem } from "../../components/SidebarItem";
import { AppbarItem } from "../../components/AppbarItem";
import ThemeToggle from "../../components/ThemeToggle";
import { Outlet, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { logout } from "../../features/auth/store/AuthSlice";

export default function MainLayout() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeItem, setActiveItem] = useState(0);
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  const handleClickUser = (event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveItem(6);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUser = () => {
    setAnchorEl(null);
  };
  const openUser = Boolean(anchorEl);
  const id = openUser ? "simple-popover" : undefined;

  const pendingLogout = status === "pendingLogout";

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          py: 1,
        })}
      >
        <Container maxWidth={"xl"}>
          <Toolbar
            sx={{
              minHeight: "48px !important",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <House
                size={38}
                color={theme.palette.primary.main}
                weight="fill"
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: 25,
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                }}
              >
                Komşu
              </Typography>
            </Box>

            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={() => {
                console.log("Ara:", query);
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { md: 2, xs: 1 },
              }}
            >
              <AppbarItem
                Icon={BellSimple}
                active={activeItem === 4}
                onClick={() => setActiveItem(4)}
              />
              <AppbarItem
                Icon={ChatsCircle}
                active={activeItem === 5}
                onClick={() => setActiveItem(5)}
              />
              <AppbarItem Icon={User} onClick={handleClickUser as any} />
              <Popover
                id={id}
                open={openUser}
                anchorEl={anchorEl}
                onClose={handleCloseUser}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  sx: {
                    boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #CAD3E5",
                    borderRadius: 3,
                  },
                }}
              >
                <Box sx={{ width: 320 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* Kullanıcı İkonu */}
                    <Avatar sx={{ width: 56, height: 56, mb: 1.5 }}>
                      <PersonOutlineIcon sx={{ fontSize: 36 }} />
                    </Avatar>

                    <Typography variant="body1">
                      {user?.neighborhood}
                    </Typography>

                    <Button
                      sx={{
                        backgroundColor: `${theme.palette.icon.background}`,
                        mt: 1,
                        borderRadius: 10,
                        textTransform: "none",
                      }}
                      onClick={() => {
                        navigate("/profile");
                        setAnchorEl(null);
                      }}
                    >
                      <Typography px={2} py={1} fontSize={16} fontWeight={600}>
                        Profilini Görüntüle
                      </Typography>
                    </Button>
                  </Box>
                  <Divider />
                  <ListItemButton onClick={() => dispatch(logout({}))}>
                    <ListItem>
                      <SignOut weight="bold" size={28} />
                      <Typography px={2} py={1} fontSize={14} fontWeight={620}>
                        {pendingLogout ? (
                          <CircularProgress size={24} thickness={5} />
                        ) : (
                          "Çıkış Yap"
                        )}
                      </Typography>
                    </ListItem>
                  </ListItemButton>
                </Box>
              </Popover>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar sx={{ minHeight: "100px !important" }} />
      <Box
        sx={{
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box
              component="nav"
              sx={{
                width: { xs: 0, md: 240 },
                flexShrink: 0,
                position: { md: "sticky" },
                top: 72,
                alignSelf: "flex-start",
                display: { xs: "none", md: "block" },
              }}
            >
              <List
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.8,
                  p: 0,
                }}
              >
                <SidebarItem
                  text="Ana Sayfa"
                  Icon={House}
                  active={activeItem === 0}
                  onClick={() => {
                    setActiveItem(0);
                    navigate("/feed");
                  }}
                />
                <SidebarItem
                  text="Satılık & Ücretsiz"
                  Icon={ShoppingBag}
                  active={activeItem === 1}
                  onClick={() => setActiveItem(1)}
                />
                <SidebarItem
                  text="Ödünç"
                  Icon={Handshake}
                  active={activeItem === 2}
                  onClick={() => setActiveItem(2)}
                />
                <SidebarItem
                  text="Etkinlikler"
                  Icon={CalendarCheck}
                  active={activeItem === 3}
                  onClick={() => setActiveItem(3)}
                />
              </List>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Post
              </Button>
              <ThemeToggle />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                width: "100%",
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
