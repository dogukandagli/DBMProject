import { Avatar, Card, CardHeader, IconButton, Typography, useTheme, Box, Stack, Button, Grid, Menu} from "@mui/material";
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
      eventId,
      title,
      coverPhotoUrl,
      description,
      startTime,
      endTime,
      formattedAddress,
      capacity, 
      price,
      createdAt,
      currentCount,
      userDto,
      eventActions,
      eventOwnerActions,
  } = request;

    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [eventSettingsAnchorEl, setEventSettingsAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const eventSettingsOpen = Boolean(eventSettingsAnchorEl)

    const handleMenuAction = (actionType: string) => {
        setAnchorEl(null);
        setEventSettingsAnchorEl(null);
        
        if (eventId) {
            onAction(actionType, eventId); 
        }
    };
    
    const formatDateTR = (isoDateString: string) => {
        if (!isoDateString) return "";
        const date = new Date(isoDateString);
        
        return format(date, "d MMMM, HH:mm", { locale: tr });
    };
  
    const displayDate = formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
        locale: tr,
    });
  
  return(

    <Card variant="outlined">  
        <CardHeader
            avatar = {
                <Avatar
                src={`${apiUrl}/user-profilephoto/${userDto.profilePhotoUrl}`}
                alt={userDto.fullName}
                >
                    {getInitials(userDto.fullName)}
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
            title = {userDto.fullName}
            subheader = {displayDate}
        />
            {coverPhotoUrl && (
                <CardMedia
                    component="img" 
                    height="370" 
                    image={`${apiUrl}/event-images/${coverPhotoUrl}`}
                    alt={title}
                />
            )}

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
                {title}
            </Typography>

            <Typography sx={{mb:1}}>
                {description}
            </Typography>

            <Box display={"flex"} sx={{mb:1}}>
                <CalendarDots size={25} />
                {formatDateTR(startTime)} -{" "}
                {formatDateTR(endTime)}
            </Box>

            <Box display={"flex"} gap={0.5}>
                <LocationPinIcon />  
                <Typography>
                    {formattedAddress}
                </Typography>
            </Box>

            <Stack direction = {"row"} justifyContent={"space-between"}>

                <Grid container direction = {"row"} spacing={2} alignItems={"center"}>

                    <Box display={"flex"} alignItems={"center"} gap={0.5}>     
                        <Users size={25} />       
                        <Typography variant="body1" sx={{fontWeight: "bold"}}>
                            {capacity === null ? currentCount : (currentCount + "/" + capacity)}
                        </Typography>
                    </Box>

                    <Box display={"flex"} alignItems={"center"} gap ={0.5}>
                        <Money size={25} />
                        <Typography variant = "body1"  sx={{fontWeight: "bold"}}>
                            {price ? `${price} ₺` : "Ücretsiz"}
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

                {userDto.isOwner && eventOwnerActions.canCancel && (
                    <MenuItem onClick={() => { handleMenuAction("cancel")}}
                        sx={{}}
                    >
                        Etkinliği iptal et
                    </MenuItem>
                )}

                {userDto.isOwner && eventOwnerActions.canDelete && (
                    <MenuItem onClick={() => { handleMenuAction("delete")}}
                        sx={{}}
                    >
                        Etkinliği sil
                    </MenuItem>
                )}

                {userDto.isOwner && eventOwnerActions.CanEdit && (
                    <MenuItem onClick={() => { handleMenuAction("edit")}}
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
                     {userDto.isOwner && (
                         <MenuItem onClick={() => { handleMenuAction("viewParticipants")}}
                            sx={{}}
                        >
                            Katılımcıları görüntüle
                        </MenuItem>
                     )}

                     {!userDto.isOwner && eventActions.canJoin && (
                        <>
                        <MenuItem onClick={() => { handleMenuAction("join")}}
                            sx={{}}
                        >
                            Gideceğim
                        </MenuItem>

                        <MenuItem onClick={() => { handleMenuAction("save")}}
                            sx={{}}
                        >
                            Katılmayı düşünüyorum
                        </MenuItem>
                        </>
                    )}

                    {!userDto.isOwner && eventActions.canLeave && (
                    <MenuItem onClick={() => { handleMenuAction("leave")}}
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