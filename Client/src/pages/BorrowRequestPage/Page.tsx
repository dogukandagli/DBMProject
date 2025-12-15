import { useEffect, useState } from "react";
import BorrowRequestDialog from "../../components/BorrowRequestDialog";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  useTheme,
  CircularProgress,
  Grid,
  IconButton,
} from "@mui/material";
import { BorrowRequestCard } from "../../components/BorrowRequestCard";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  clearBorrowRequests,
  getBorrowRequests,
  getMyBorrowRequests,
  selectAllBorrowRequests,
} from "../../features/borrowRequests/store/BorrowRequestSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { ArrowLeft } from "@phosphor-icons/react";
const IllustrationUrl =
  "https://cdn-icons-png.flaticon.com/512/7486/7486831.png";

export default function BorrowRequestPage() {
  const dispatch = useAppDispatch();
  const borrowRequests = useAppSelector(selectAllBorrowRequests);
  const { hasMore } = useAppSelector((state) => state.borrowRequests);
  const [active, setActive] = useState(0);

  const handleAction = (type: string, id: string) => {
    console.log(`Action: ${type} for Item: ${id}`);
  };
  const theme = useTheme();
  const [isBorrowRequestDialogOpen, SetIsBorrowRequestDialogOpen] =
    useState(false);
  const handleCloseBorrowRequestDialog = () => {
    SetIsBorrowRequestDialogOpen(false);
  };
  const handleBorrowRequestDialog = (data: boolean) => {
    SetIsBorrowRequestDialogOpen(data);
  };

  useEffect(() => {
    dispatch(clearBorrowRequests());
    if (active === 0) {
      dispatch(getBorrowRequests());
    } else if (active === 1) {
      dispatch(getMyBorrowRequests());
    }

    return () => {
      dispatch(clearBorrowRequests());
    };
  }, [dispatch, active]);

  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: active === 1 ? "row" : "column",
            justifyContent: active === 1 ? "space-between" : "flex-start",
            alignItems: active === 1 ? "center" : "flex-start",
            gap: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            {active === 1 && (
              <IconButton onClick={() => setActive(0)}>
                <ArrowLeft color={theme.palette.icon.main} size={32} />
              </IconButton>
            )}

            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.15rem", sm: "1.5rem" },
              }}
            >
              {active === 1
                ? "Ödünç isteklerin"
                : "Yakınlarındaki ödünç istekleri"}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => handleBorrowRequestDialog(true)}
              sx={{
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: 600,
                padding: { xs: "4px 12px", sm: "8px 24px" },
                bgcolor: `${theme.palette.icon.main}`,
              }}
            >
              Ödünç isteği oluştur
            </Button>

            {active !== 1 && (
              <Button
                variant="contained"
                onClick={() => setActive(1)}
                sx={{
                  borderRadius: "50px",
                  textTransform: "none",
                  fontWeight: 600,
                  padding: "8px 24px",
                  bgcolor: `${theme.palette.icon.background}`,
                  color: `${theme.palette.icon.main}`,
                  boxShadow: "none",
                }}
              >
                Ödünç isteklerin
              </Button>
            )}
          </Stack>
        </Box>

        {borrowRequests ? (
          <InfiniteScroll
            dataLength={borrowRequests.length}
            next={() =>
              active === 0
                ? dispatch(getBorrowRequests())
                : dispatch(getMyBorrowRequests())
            }
            hasMore={hasMore}
            loader={
              <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
                <CircularProgress size={20} />
              </Box>
            }
            endMessage={
              borrowRequests.length > 0 && (
                <Typography
                  variant="caption"
                  display="block"
                  align="center"
                  color="text.secondary"
                  py={2}
                >
                  Tüm ödünç istekleri listelendi.
                </Typography>
              )
            }
          >
            <Grid container spacing={2}>
              {borrowRequests.map((borrowRequest) => (
                <Grid key={borrowRequest.id} size={{ xs: 12, md: 4 }}>
                  <BorrowRequestCard
                    request={borrowRequest}
                    onAction={handleAction}
                  />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Box
              component="img"
              src={IllustrationUrl}
              alt="No events illustration"
              sx={{
                width: "280px",
                height: "auto",
                opacity: 0.8,
                mb: 3,
                filter: "grayscale(100%)",
              }}
            />

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Henüz ödünç isteği yok
            </Typography>

            <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
              Hemen ödünç isteği oluşturup, komşularından yardım isteyebilirsin
            </Typography>

            <Button
              variant="contained"
              onClick={() => {
                handleBorrowRequestDialog(true);
              }}
              sx={{
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: `${theme.palette.icon.main}`,
                padding: "10px 32px",
              }}
            >
              Ödünç isteği oluştur
            </Button>
          </Box>
        )}
      </Container>

      <BorrowRequestDialog
        open={isBorrowRequestDialogOpen}
        onClose={handleCloseBorrowRequestDialog}
      />
    </>
  );
}
