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
  isBorrowRequestStatusType,
} from "../../entities/BorrowRequest/ConditionEnum";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  acceptOffer,
  cancelBorrowRequest,
  deleteBorrowRequest,
  getBorrowRequestDetail,
  rejectOffer,
} from "../../features/borrowRequests/store/BorrowRequestSlice";
import { apiUrl } from "../../shared/api/ApiClient";
import { OfferCard } from "../../components/OfferCard";

export const BorrowRequestDetailPage: FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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

  const handleAcceptOffer = async (offerId: string) => {
    const result = await dispatch(
      acceptOffer({
        borrowRequestId: data.id,
        offerId,
      })
    );

    if (acceptOffer.fulfilled.match(result)) {
      dispatch(getBorrowRequestDetail(data.id));
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    const result = await dispatch(
      rejectOffer({ borrowRequestId: data.id, offerId })
    );
    if (rejectOffer.fulfilled.match(result)) {
      dispatch(getBorrowRequestDetail(data.id));
    }
  };

  const handleCancelBorrowRequest = async (borrowRequestId: string) => {
    const result = await dispatch(cancelBorrowRequest({ borrowRequestId }));
    if (cancelBorrowRequest.fulfilled.match(result)) {
      dispatch(getBorrowRequestDetail(borrowRequestId));
    }
  };

  const handleDeleteBorrowRequest = async (borrowRequestId: string) => {
    const result = await dispatch(deleteBorrowRequest(borrowRequestId));
    if (deleteBorrowRequest.fulfilled.match(result)) {
      navigate("/borrowRequests");
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
  const pendingRejectOffer = status === "pendingRejectOffer";
  const pendingCancelBorrowRequest = status === "pendingCancelBorrowRequest";
  const pendingDeleteBorrowRequest = status == "pendingDeleteBorrowRequest";

  const label = BorrowRequestStatusLabels[data.status];

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        {/* SOL TARAF: İSTEK DETAYLARI (Değişmedi) */}
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
                    disabled={pendingCancelBorrowRequest}
                    onClick={() => handleCancelBorrowRequest(data.id)}
                    variant="outlined"
                    startIcon={<XCircle size={25} />}
                    sx={{
                      color: `${theme.palette.icon.main}`,
                    }}
                  >
                    {pendingCancelBorrowRequest ? (
                      <CircularProgress size={10} />
                    ) : (
                      " İptal et"
                    )}
                  </Button>
                )}
                {actions.canDelete && (
                  <IconButton
                    disabled={pendingDeleteBorrowRequest}
                    onClick={() => handleDeleteBorrowRequest(data.id)}
                  >
                    {pendingDeleteBorrowRequest ? (
                      <CircularProgress size={6} />
                    ) : (
                      <Trash color="#c62828" size={25} />
                    )}
                  </IconButton>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* SAĞ TARAF: TEKLİFLER (Refactor Edildi) */}
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
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onAccept={handleAcceptOffer}
                onReject={handleRejectOffer}
                isAccepting={pendingAcceptOffer}
                isRejecting={pendingRejectOffer}
                onCancel={null}
                isCancelling={false}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};
