import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  Stack,
  Divider,
  Container,
  CardHeader,
  useTheme,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import type { BorrowRequestDetailDto } from "../../entities/BorrowRequest/BorrowRequestDetailDto";
import { getInitials } from "../EditProfilePage/Page";
import { CalendarDots } from "@phosphor-icons/react";
import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  ConditionLabels,
  HandoverMethodLabels,
} from "../../entities/BorrowRequest/ConditionEnum";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

export const BorrowRequestDetailPage: React.FC<{
  data: BorrowRequestDetailDto;
}> = ({ data }) => {
  const theme = useTheme();

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

  return (
    <Container maxWidth="lg">
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
                <Chip
                  label={"Open Request"}
                  color="success"
                  size="small"
                  variant="outlined"
                />
              </Stack>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {itemNeeded.title}
              </Typography>
              <CardHeader
                avatar={
                  <Avatar
                    src={borrower.profileImageUrl || undefined}
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
                  image={itemNeeded.imageUrl}
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

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                {actions.canEdit && (
                  <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    color="primary"
                  >
                    Edit Request
                  </Button>
                )}
                {actions.canCancel && (
                  <Button startIcon={<CancelIcon />} color="warning">
                    Cancel
                  </Button>
                )}
                {actions.canDelete && (
                  <Button startIcon={<DeleteIcon />} color="error">
                    Delete
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* SAĞ KOLON: TEKLİFLER */}
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
              return (
                <Card
                  key={offer.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 5,
                    position: "relative",
                    overflow: "visible",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        src={offer.lender.profileImageUrl || undefined}
                        alt={offer.lender.fullName}
                      >
                        {getInitials(offer.lender.fullName)}
                      </Avatar>
                    }
                    title={offer.lender.fullName}
                    subheader={displayDate}
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
                                image={media}
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

                  <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 7 }}>
                        {offer.actions.canAccept && (
                          <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            disableElevation
                            size="medium"
                            sx={{
                              borderRadius: 5,
                              textTransform: "none",
                              fontWeight: "bold",
                            }}
                          >
                            Kabul et
                          </Button>
                        )}
                      </Grid>
                      <Grid size={{ xs: 5 }}>
                        {offer.actions.canReject && (
                          <Button
                            variant="outlined"
                            fullWidth
                            size="medium"
                            sx={{
                              borderRadius: 5,
                              textTransform: "none",
                              borderColor: `${theme.palette.icon.main}`,
                              color: `${theme.palette.icon.main}`,
                            }}
                          >
                            Reddet
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};
