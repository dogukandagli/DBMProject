import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Divider,
  List,
  Paper,
  Toolbar,
  Typography,
  useTheme,
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
import ThemeToggle from "../../components/ThemeToggle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Outlet } from "react-router";

export default function MainLayout() {
  const [query, setQuery] = useState("");
  const [activeItem, setActiveItem] = useState(0);
  const theme = useTheme();
  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          borderBottom: "1px solid #f0f0f0",
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
            <Box
              component="nav"
              sx={{
                width: 240,
                flexShrink: 0,
                position: "sticky",
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
              <ThemeToggle />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                maxWidth: 640,
              }}
            >
              <Outlet />
            </Box>

            <Box
              sx={{
                width: 240,
                flexShrink: 0,
                position: "sticky",
                top: 72,
                alignSelf: "flex-start",
                display: { xs: "none", md: "block" },
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  maxWidth: 320,
                }}
              >
                <CardActionArea sx={{ alignItems: "stretch" }}>
                  <CardContent sx={{ pb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography fontWeight={600} fontSize={15}>
                          Dupont Circle
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize={13}
                        >
                          Washington
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      py: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, fontSize: 13 }}
                    >
                      See all alerts
                    </Typography>

                    <ChevronRightIcon fontSize="small" />
                  </Box>
                </CardActionArea>
              </Card>
              <Paper sx={{ mb: 2, p: 2, borderRadius: 3 }}>Right Card 2</Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
