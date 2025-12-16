import { useEffect, type FC } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  Stack,
  Container,
  CardHeader,
  useTheme,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { getInitials } from "../EditProfilePage/Page";
import {
  CalendarDots,
  PencilLine,
  Trash,
  XCircle,
} from "@phosphor-icons/react";
import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  BorrowRequestStatusLabels,
  ConditionLabels,
  HandoverMethodLabels,
  isBorrowRequestStatusType,
  isOfferStatusType,
  OfferStatusLabels,
} from "../../entities/BorrowRequest/ConditionEnum";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  acceptOffer,
  getBorrowRequestDetail,
} from "../../features/borrowRequests/store/BorrowRequestSlice";
import { apiUrl } from "../../shared/api/ApiClient";
import { isFulfilled } from "@reduxjs/toolkit";

export const BorrowRequestDetailPage: FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const data = useAppSelector((state) => state.borrowRequests.borrowRequest);
  const { status } = useAppSelector((state) => state.borrowRequests);

  useEffect(() => {
    if (id) {
      dispatch(getBorrowRequestDetail(id));
    }
  }, [id, dispatch]);

  if (!data) {
    return <>Yükleniyor...</>;
  }

  const handleAcceptOffer = async (
    borrowRequestId: string,
    offerId: string
  ) => {
    const result = await dispatch(
      acceptOffer({
        borrowRequestId,
        offerId,
      })
    );

    if (acceptOffer.fulfilled.match(result)) {
      dispatch(getBorrowRequestDetail(borrowRequestId));
    }
  };

  const { itemNeeded, borrower, neededDates, actions, offers } = data;

  const displayDate = formatDistanceToNow(new Date(data.createdAt), {
    addSuffix: true,
    locale: tr,
  });

  const formatDateTR = (isoDateString: string) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    return format(date, "d MMMM, HH:mm", { locale: tr });
  };
  if (!isBorrowRequestStatusType(data.status)) {
    return <Chip label="Bilinmeyen Durum" />;
  }

  const pendingAcceptOffer = status === "pendingAcceptOffer";
  const label = BorrowRequestStatusLabels[data.status];
  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  {itemNeeded.category.toUpperCase()}
                </Typography>
                <Chip label={label} size="medium" variant="outlined" />
              </Stack>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {itemNeeded.title}
              </Typography>
              <CardHeader
                avatar={
                  <Avatar
                    src={`${apiUrl}user-profilephoto/${borrower.profileImageUrl}`}
                    alt={borrower.fullName}
                  >
                    {getInitials(borrower.fullName)}
                  </Avatar>
                }
                title={borrower.fullName}
                subheader={displayDate}
              />

              {itemNeeded.imageUrl && (
                <CardMedia
                  component="img"
                  height="300"
                  image={`${apiUrl}borrowrequest-image/${itemNeeded.imageUrl}`}
                  alt={itemNeeded.title}
                  sx={{ borderRadius: 1, mb: 3, objectFit: "cover" }}
                />
              )}

              <Typography variant="h6" gutterBottom fontWeight="600">
                Açıklama
              </Typography>
              <Typography
                variant="body1"
                color="text.main"
                paragraph
                sx={{ mb: 4 }}
              >
                {itemNeeded.description}
              </Typography>

              <Stack direction={"row"} spacing={2} mb={4} alignItems="center">
                <CalendarDots size={25} />
                <Typography variant="body1" fontWeight={500}>
                  {formatDateTR(neededDates.startDate)} -{" "}
                  {formatDateTR(neededDates.endDate)}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                justifyContent={"space-between"}
              >
                {actions.canEdit && (
                  <Button
                    fullWidth
                    startIcon={<PencilLine size={25} />}
                    variant="outlined"
                    sx={{
                      color: `${theme.palette.icon.main}`,
                      background: `${theme.palette.icon.background}`,
                    }}
                  >
                    İsteğini düzenle
                  </Button>
                )}
                {actions.canCancel && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<XCircle size={25} />}
                    sx={{
                      color: `${theme.palette.icon.main}`,
                    }}
                  >
                    İptal et
                  </Button>
                )}
                {actions.canDelete && (
                  <IconButton>
                    <Trash color="#c62828" size={25} />
                  </IconButton>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Alınan Teklifler
            </Typography>
          </Stack>

          <Stack spacing={2}>
            {offers.map((offer) => {
              if (!isOfferStatusType(offer.status)) {
                return <Chip label="Bilinmeyen Durum" />;
              }
              const cfg = OfferStatusLabels[offer.status];

              return (
                <Card
                  key={offer.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 7,
                    position: "relative",
                    overflow: "visible",
                    background: `${cfg.sx.backgroundColor}`,
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        src={`${apiUrl}user-profilephoto/${offer.lender.profileImageUrl}`}
                        alt={offer.lender.fullName}
                      >
                        {getInitials(offer.lender.fullName)}
                      </Avatar>
                    }
                    title={offer.lender.fullName}
                    subheader={displayDate}
                    action={<Chip label={cfg.label} sx={cfg.sx} />}
                  />
                  <CardContent>
                    {offer.itemImageUrls && (
                      <Box
                        mb={2}
                        sx={{
                          width: "100%",
                          bgcolor: "#f0f0f0",
                          position: "relative",
                          "& .swiper-pagination-bullet": {
                            backgroundColor: "rgba(19, 16, 16, 0.6)",
                            opacity: 1,
                          },
                          "& .swiper-pagination-bullet-active": {
                            backgroundColor: "#0f0e0eff",
                          },
                          "& .swiper-button-next, & .swiper-button-prev": {
                            color: "#0f0e0eff",
                            transform: "scale(0.6)",
                          },
                        }}
                      >
                        <Swiper
                          modules={[Pagination, Navigation]}
                          spaceBetween={0}
                          slidesPerView={1}
                          navigation={offer.itemImageUrls.length > 1}
                          pagination={
                            offer.itemImageUrls.length > 1
                              ? { clickable: true, dynamicBullets: true }
                              : false
                          }
                          style={{ width: "100%", height: "auto" }}
                        >
                          {offer.itemImageUrls.map((media, index) => (
                            <SwiperSlide key={index}>
                              <CardMedia
                                component="img"
                                image={`${apiUrl}/offer-images/${media}`}
                                alt="Post media"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </Box>
                    )}

                    <Stack direction="row" spacing={1} mb={2}>
                      <Chip
                        label={ConditionLabels[1]}
                        size="medium"
                        sx={{
                          bgcolor: `${theme.palette.icon.background}`,
                          color: `${theme.palette.icon.main}`,
                          fontWeight: "bold",
                          borderRadius: 1,
                        }}
                      />
                      <Chip
                        label={HandoverMethodLabels[2]}
                        size="medium"
                        sx={{
                          bgcolor: `${theme.palette.icon.background}`,
                          color: `${theme.palette.icon.main}`,
                          fontWeight: "bold",
                          borderRadius: 1,
                        }}
                      />
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.main"
                      sx={{ fontStyle: "italic", mb: 1 }}
                    >
                      "{offer.description}"
                    </Typography>
                  </CardContent>

                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent={"space-between"}
                    marginX={2}
                    marginBottom={1}
                  >
                    {offer.actions.canAccept && (
                      <Button
                        fullWidth
                        color="success"
                        disabled={pendingAcceptOffer}
                        onClick={() => handleAcceptOffer}
                        variant="outlined"
                        sx={{
                          backgroundColor: "rgba(0, 200, 83, 0.15)",
                        }}
                      >
                        {pendingAcceptOffer ? (
                          <CircularProgress size={10} />
                        ) : (
                          "Kabul et"
                        )}
                      </Button>
                    )}
                    {offer.actions.canReject && (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        sx={{
                          backgroundColor: "rgba(211, 47, 47, 0.15)",
                        }}
                      >
                        Reddet
                      </Button>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};
