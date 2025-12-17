// components/OfferCard.tsx (veya klasör yapınıza göre uygun bir yer)
import { type FC } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  Typography,
  Box,
  Stack,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import {
  ConditionLabels,
  HandoverMethodLabels,
  isOfferStatusType,
  OfferStatusLabels,
} from "../entities/BorrowRequest/ConditionEnum";
import { getInitials } from "../pages/EditProfilePage/Page";
import { apiUrl } from "../shared/api/ApiClient";
import type { OfferDto } from "../entities/BorrowRequest/BorrowRequestDetailDto";

// Buraya Offer tipini import etmeniz gerekebilir (örn: import { Offer } from '../../types')
// Şimdilik 'any' veya interface tanımlıyoruz, projenizdeki gerçek tipi kullanın.
interface OfferCardProps {
  offer: OfferDto;
  onAccept: ((offerId: string) => void) | null;
  onReject: ((offerId: string) => void) | null;
  onCancel: ((offerId: string) => void) | null;
  isAccepting: boolean;
  isRejecting: boolean;
  isCancelling: boolean;
}

export const OfferCard: FC<OfferCardProps> = ({
  offer,
  onAccept,
  onReject,
  onCancel,
  isAccepting,
  isRejecting,
  isCancelling,
}) => {
  const theme = useTheme();

  if (!isOfferStatusType(offer.status)) {
    return <Chip label="Bilinmeyen Durum" />;
  }

  const cfg = OfferStatusLabels[offer.status];

  const displayDate = formatDistanceToNow(new Date(offer.createdAt), {
    addSuffix: true,
    locale: tr,
  });

  console.log(offer);
  return (
    <Card
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
        {offer.itemImageUrls && offer.itemImageUrls.length > 0 && (
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
              style={{ width: "100%", height: "auto" } as any}
            >
              {offer.itemImageUrls.map((media: string, index: number) => (
                <SwiperSlide key={index}>
                  <CardMedia
                    component="img"
                    image={`${apiUrl}/offer-images/${media}`}
                    alt="Offer item"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        )}

        <Stack direction="row" spacing={1} mb={2}>
          <Chip
            label={ConditionLabels[offer.condition]}
            size="medium"
            sx={{
              bgcolor: `${theme.palette.icon.background}`, // Theme tipinize göre kontrol edin
              color: `${theme.palette.icon.main}`, // Theme tipinize göre kontrol edin
              fontWeight: "bold",
              borderRadius: 1,
            }}
          />
          <Chip
            label={HandoverMethodLabels[offer.handoverMethod]}
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
        {offer.actions && (
          <>
            {offer.actions.canAccept && (
              <Button
                fullWidth
                color="success"
                disabled={isAccepting}
                onClick={() => onAccept?.(offer.id)}
                variant="outlined"
                sx={{
                  backgroundColor: "rgba(0, 200, 83, 0.15)",
                }}
              >
                {isAccepting ? <CircularProgress size={10} /> : "Kabul et"}
              </Button>
            )}
            {offer.actions.canReject && (
              <Button
                fullWidth
                disabled={isRejecting}
                onClick={() => onReject?.(offer.id)}
                variant="outlined"
                color="error"
                sx={{
                  backgroundColor: "rgba(211, 47, 47, 0.15)",
                }}
              >
                {isRejecting ? <CircularProgress size={10} /> : "Reddet"}
              </Button>
            )}
          </>
        )}
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        justifyContent={"space-between"}
        marginX={2}
        marginBottom={1}
      >
        {offer.offerSideActionsDto && (
          <>
            {offer.offerSideActionsDto.canUpdate && (
              <Button fullWidth variant="outlined">
                {"Duzenle"}
              </Button>
            )}
            {offer.offerSideActionsDto?.canCancel && (
              <Button
                fullWidth
                disabled={isCancelling}
                onClick={() => onCancel?.(offer.id)}
                variant="outlined"
                sx={{
                  color: `${theme.palette.icon.main}`,
                }}
              >
                {isCancelling ? <CircularProgress size={10} /> : "İptal et"}
              </Button>
            )}
          </>
        )}
      </Stack>
    </Card>
  );
};
