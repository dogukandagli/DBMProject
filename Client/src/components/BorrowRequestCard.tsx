import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  LocalOffer as OfferIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { BorrowRequestDto } from "../entities/BorrowRequest/BorrowRequestDto";
import {
  CalendarDots,
  DotsThree,
  Gift,
  PencilLine,
  Trash,
} from "@phosphor-icons/react";
import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { apiUrl } from "../shared/api/ApiClient";
import { getInitials } from "../pages/EditProfilePage/Page";
import OfferDialog from "./OfferDialog";

interface BorrowRequestCardProps {
  request: BorrowRequestDto;
  onAction: (actionType: string, id: string) => void;
}

export const BorrowRequestCard: React.FC<BorrowRequestCardProps> = ({
  request,
  onAction,
}) => {
  const {
    borrower,
    itemNeeded,
    neededDates,
    offerSummaryDto,
    borrowRequestActionsDto,
    offerCount,
  } = request;

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [offerAnchorEl, setOfferAnchorEl] = useState<null | HTMLElement>(null);
  const isOfferMenuOpen = Boolean(offerAnchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleOfferMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setOfferAnchorEl(event.currentTarget);
  };
  const handleOfferMenuClose = () => {
    setOfferAnchorEl(null);
  };

  const displayDate = formatDistanceToNow(new Date(request.createdAt), {
    addSuffix: true,
    locale: tr,
  });
  const formatDateTR = (isoDateString: string) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    return format(date, "d MMMM, HH:mm", { locale: tr });
  };

  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  const handleCloseOfferDialog = () => {
    setIsOfferDialogOpen(false);
  };
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          boxShadow: "none",
          borderColor: "divider",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              src={`${apiUrl}/user-profilephoto/${borrower.profileImageUrl}`}
              alt={borrower.fullName}
            >
              {getInitials(borrower.fullName)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <DotsThree
                weight="bold"
                color={theme.palette.icon.main}
                size={32}
              />
            </IconButton>
          }
          title={borrower.fullName}
          subheader={`${displayDate}`}
        />
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { borderRadius: 2, minWidth: 180, mt: 1, p: 0.5 },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {borrowRequestActionsDto.canEdit && (
            <MenuItem
              onClick={() => {
                handleMenuClose;
              }}
            >
              <ListItemIcon>
                <PencilLine
                  color={theme.palette.icon.main}
                  size={26}
                  weight="bold"
                />
              </ListItemIcon>
              <ListItemText>Düzenle</ListItemText>
            </MenuItem>
          )}
          {borrowRequestActionsDto.canCancel && (
            <MenuItem onClick={() => {}} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <Trash
                  weight="bold"
                  color={theme.palette.icon.main}
                  size={26}
                />
              </ListItemIcon>
              <ListItemText>İptal Et</ListItemText>
            </MenuItem>
          )}
        </Menu>

        {/* MEDIA: Ürün Görseli (Varsa) */}
        {itemNeeded.imageUrl && (
          <CardMedia
            component="img"
            height="180"
            image={`${apiUrl}/borrowrequest-image/${itemNeeded.imageUrl}`}
            alt={itemNeeded.title}
            sx={{ objectFit: "cover" }}
          />
        )}

        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {itemNeeded.title}
            </Typography>
            <Chip label={itemNeeded.category} size="small" />
          </Stack>

          <Typography
            variant="body2"
            color="text.main"
            paragraph
            sx={{ minHeight: "40px" }}
          >
            {itemNeeded.description}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} color="text.primary">
            <CalendarDots size={25} />
            <Typography variant="body2" fontWeight={500}>
              {formatDateTR(neededDates.startDate)} -{" "}
              {formatDateTR(neededDates.endDate)}
            </Typography>
          </Box>

          {offerSummaryDto && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                bgcolor: "action.hover",
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "primary.light",
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <OfferIcon fontSize="small" color="primary" />
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight="bold"
                >
                  Senin Teklifin ({offerSummaryDto.offerStatus})
                </Typography>
              </Box>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                {offerSummaryDto.description}
              </Typography>
            </Box>
          )}
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "flex-end",
            px: 2,
            pb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {borrowRequestActionsDto.canViewOffers && (
            <Button
              size="small"
              startIcon={<Gift size={25} />}
              onClick={() => onAction("VIEW_OFFERS", request.id)}
              sx={{
                color: `${theme.palette.icon.main}`,
              }}
            >
              Teklifler ({offerCount})
            </Button>
          )}

          {borrowRequestActionsDto.canMakeOffer && (
            <Button
              variant="contained"
              size="small"
              disableElevation
              onClick={() => setIsOfferDialogOpen(true)}
              sx={{
                background: `${theme.palette.icon.main}`,
              }}
            >
              Teklif Ver
            </Button>
          )}

          {borrowRequestActionsDto.hasOffered && (
            <>
              <Button
                id="offer-menu-button"
                aria-controls={isOfferMenuOpen ? "offer-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={isOfferMenuOpen ? "true" : undefined}
                variant="outlined"
                color="success"
                size="small"
                onClick={handleOfferMenuClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Teklifiniz Var
              </Button>

              <Menu
                id="offer-menu"
                anchorEl={offerAnchorEl}
                open={isOfferMenuOpen}
                onClose={handleOfferMenuClose}
                MenuListProps={{
                  "aria-labelledby": "offer-menu-button",
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <VisibilityIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Teklifi Görüntüle</ListItemText>
                </MenuItem>

                {/* Düzenle */}
                {borrowRequestActionsDto.canEditOffer && (
                  <MenuItem>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Teklifi Düzenle</ListItemText>
                  </MenuItem>
                )}

                {/* Geri Çek */}
                {borrowRequestActionsDto.canWithdrawOffer && (
                  <MenuItem sx={{ color: "error.main" }}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Teklifi Geri Çek</ListItemText>
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </CardActions>
        <OfferDialog
          open={isOfferDialogOpen}
          onClose={handleCloseOfferDialog}
          borrowRequest={request}
        />
      </Card>
    </>
  );
};
