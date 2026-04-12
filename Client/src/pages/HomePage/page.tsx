import { Box, Typography } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import { NavLink } from "react-router";

export default function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
      }}
    >
      <Typography
        component={NavLink}
        to={"/login"}
        variant="h4"
        fontWeight={700}
      >
        Giriş yap kankiii
      </Typography>
    </Box>
  );
}
