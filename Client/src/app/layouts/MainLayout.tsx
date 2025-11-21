import {
  AppBar,
  Box,
  Button,
  Container,
  List,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  BellSimple,
  CalendarCheck,
  ChatsCircle,
  Handshake,
  House,
  ShoppingBag,
  User,
} from "@phosphor-icons/react/dist/ssr";
import { SearchBar } from "../../components/SearchBar";
import { useState } from "react";
import { SidebarItem } from "../../components/SidebarItem";
import { AppbarItem } from "../../components/AppbarItem";

export default function MainLayout() {
  const [query, setQuery] = useState("");
  const [activeItem, setActiveItem] = useState(0);

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #f0f0f0",
        }}
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
              <House size={38} color="#3a5ecb" weight="fill" />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: 25,
                  color: "#3a5ecb",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
              <AppbarItem
                Icon={User}
                active={activeItem === 6}
                onClick={() => setActiveItem(6)}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        sx={{
          minHeight: "100vh",
          mt: 2,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              gap: 3,
              py: 3,
            }}
          >
            {/* SOL SIDEBAR */}
            <Box
              component="nav"
              sx={{
                width: 240,
                flexShrink: 0,
                position: "sticky",
                top: 72, // AppBar yüksekliğine göre ayarla
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
                  onClick={() => setActiveItem(0)}
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
            </Box>

            {/* ORTA FEED */}
            <Box
              sx={{
                flexGrow: 1,
                maxWidth: 640,
              }}
            ></Box>

            {/* SAĞ PANEL (opsiyonel, istersen silebilirsin) */}
            <Box
              sx={{
                width: 280,
                display: { xs: "none", md: "block" },
              }}
            >
              <Paper sx={{ mb: 2, p: 2, borderRadius: 3 }}>Right Card 1</Paper>
              <Paper sx={{ mb: 2, p: 2, borderRadius: 3 }}>Right Card 2</Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
