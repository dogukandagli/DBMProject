import React, { useEffect, useState } from "react";
import { Fab, Zoom } from "@mui/material";
import { ArrowUp } from "@phosphor-icons/react";

const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={visible}>
      <Fab
        size="medium"
        color="primary"
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 90,
          right: 24,
          zIndex: 999,
        }}
        aria-label="Yukarı çık"
      >
        <ArrowUp size={22} weight="bold" />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTop;