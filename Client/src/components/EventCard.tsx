import { Avatar, Card, CardHeader, IconButton, Typography, useTheme, Box, Stack, Button, Grid, Menu, Chip} from "@mui/material";
import type { EventCreateDto } from "../entities/event/UserEvent";
import { apiUrl } from "../shared/api/ApiClient";
import { getInitials } from "../pages/EditProfilePage/Page";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Users, Money } from "@phosphor-icons/react";
import { tr } from "date-fns/locale";
import { format, formatDistanceToNow } from "date-fns";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import MenuItem from '@mui/material/MenuItem';
import {useState} from "react"

import {
  CalendarDots,
  DotsThree,
} from "@phosphor-icons/react";

interface EventCardProps {
  request: EventCreateDto;
  onAction: (actionType: string, id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  request,
  onAction,
}) => {
  const {
      EventId,
      Title,
      CoverPhotoUrl,
      Description,
      EventStartDate,
      EventEndDate,
      FormattedAddress,
      Capacity, 
      Price,
      CurrentCount,
      UserDto,
      EventActionsDto,
      EventOwnerActionsDto,
  } = request;

    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [eventSettingsAnchorEl, setEventSettingsAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const eventSettingsOpen = Boolean(eventSettingsAnchorEl)

    const formatDateTR = (isoDateString: string) => {
        if (!isoDateString) return "";
        const date = new Date(isoDateString);
        return format(date, "d MMMM, HH:mm", { locale: tr });
    };
  
    const displayDate = formatDistanceToNow(new Date(request.CreatedAt), {
        addSuffix: true,
        locale: tr,
    });
  
  return(

    <Card variant="outlined">  
        <CardHeader
            avatar = {
                <Avatar
                src={`${apiUrl}/user-profilephoto/${UserDto.ProfilePhotoUrl}`}
                alt={UserDto.FullName}
                >
                    {getInitials(UserDto.FullName)}
                </Avatar>  
            }
            action = {
              <IconButton aria-label="settings"
               onClick={(e) => setEventSettingsAnchorEl(e.currentTarget)}>
                <DotsThree              
                    weight="bold"
                    color={theme.palette.icon.main}
                    size={32}
                />
              </IconButton>
            }
            title = {UserDto.FullName}
            subheader = {displayDate}
        />
        <CardMedia
            src = {`${apiUrl}/user-profilephoto/${request.CoverPhotoUrl}`}
        />  

        <CardContent>

            <Typography 
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.15rem", sm: "1.5rem" },
                  alignContent: "center"
                }}    
            >
                {request.Title}
            </Typography>

            <Typography sx={{mb:1}}>
                {request.Description}
            </Typography>

            <Box display={"flex"} sx={{mb:1}}>
                <CalendarDots size={25} />
                {formatDateTR(request.EventStartDate)} -{" "}
                {formatDateTR(request.EventEndDate ? request.EventEndDate : "")}
            </Box>

            <Box display={"flex"} gap={0.5}>
                <LocationPinIcon />  
                <Typography>
                    {request.FormattedAddress}
                </Typography>
            </Box>

            <Stack direction = {"row"} justifyContent={"space-between"}>

                <Grid container direction = {"row"} spacing={2} alignItems={"center"}>

                    <Box display={"flex"} alignItems={"center"} gap={0.5}>     
                        <Users size={25} />       
                        <Typography variant="body1" sx={{fontWeight: "bold"}}>
                            {request.Capacity === 0 ? request.CurrentCount : request.CurrentCount + "/" + request.Capacity}
                        </Typography>
                    </Box>

                    <Box display={"flex"} alignItems={"center"} gap ={0.5}>
                        <Money size={25} />
                        <Typography variant = "body1"  sx={{fontWeight: "bold"}}>
                            {request.Price ? `${request.Price} ₺` : "Ücretsiz"}
                        </Typography>
                    </Box>
                </Grid>

                <CardActions>
                    <Button
                        endIcon= {<ArrowDropDownIcon/>}
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                            borderRadius: "0px", 
                            color: `${theme.palette.icon.main}`
                        }}
                    >
                        İşlemler
                    </Button>
                </CardActions>       
            </Stack>

            <Menu
                anchorEl={eventSettingsAnchorEl}
                open={eventSettingsOpen}
                onClose={() => setEventSettingsAnchorEl(null)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                >

                {request.UserDto.IsOwner && request.EventOwnerActionsDto.CanCancel && (
                    <MenuItem onClick={() => { setEventSettingsAnchorEl(null);}}
                        sx={{}}
                    >
                        Etkinliği iptal et
                    </MenuItem>
                )}

                {request.UserDto.IsOwner && request.EventOwnerActionsDto.CanDelete && (
                    <MenuItem onClick={() => { setEventSettingsAnchorEl(null);}}
                        sx={{}}
                    >
                        Etkinliği sil
                    </MenuItem>
                )}

                {request.UserDto.IsOwner && request.EventOwnerActionsDto.CanEdit && (
                    <MenuItem onClick={() => { setEventSettingsAnchorEl(null);}}
                        sx={{}}
                    >
                        Etkinliği düzenle
                    </MenuItem>
                )}
            </Menu>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    >
                     {request.UserDto.IsOwner && (
                         <MenuItem onClick={() => { setAnchorEl(null);}}
                            sx={{}}
                        >
                            Katılımcıları görüntüle
                        </MenuItem>
                     )}

                     {!request.UserDto.IsOwner && request.EventActionsDto.CanJoin && (
                        <>
                        <MenuItem onClick={() => { setAnchorEl(null);}}
                            sx={{}}
                        >
                            Gideceğim
                        </MenuItem>

                        <MenuItem onClick={() => { setAnchorEl(null);}}
                            sx={{}}
                        >
                            Katılmayı düşünüyorum
                        </MenuItem>
                        </>
                    )}

                    {!request.UserDto.IsOwner && request.EventActionsDto.CanLeave && (
                    <MenuItem onClick={() => { setAnchorEl(null);}}
                        sx={{}}
                    >
                        Ayrıl
                    </MenuItem>
                    )}

                </Menu>
        </CardContent>

    </Card>

    
  )
}