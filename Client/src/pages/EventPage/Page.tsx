import { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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
  TextField,
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
import EventCreateDialog from "../../components/EventCreateDialog";

export default function EventPage(){

    const theme = useTheme();

    const [IsEventCreateDialogOpen, SetEventCreateDialog] = useState(false);
    const [active, setActive] = useState(0);
    const [eventActive, setEventActive] = useState(0);

    const handleEventCreateDialog = (data: any) => {
      SetEventCreateDialog(data)
    }

    const handleEventCreateDialogClose = () => {
      SetEventCreateDialog(false)
    }

    return (

        <Container maxWidth = "lg">

          <Stack direction={active === 0 ? "column" : "row"} spacing={2} sx={{mb:2}}
          justifyContent="space-between">

            <Grid container direction={"row"} spacing={1} >
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
                  alignContent: "center"
                }}            
              >
                {active === 0 ? "Yakınındakı etkinlikler" : "Etkinliklerim"}  
              </Typography>
            </Grid>

            <Grid>
              <Stack direction={"row"} spacing={2}>
              
              <Button
                variant="contained"
                onClick={() => handleEventCreateDialog(true)}
                sx={{
                  borderRadius: "50px",
                  textTransform: "none",
                  fontWeight: 600,
                  padding: { xs: "4px 12px", sm: "8px 24px" },
                  bgcolor: `${theme.palette.icon.main}`,
                }}
              >
                Etkinlik oluştur
              </Button>

                {active === 0 && (
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
                  Etkinliklerin
                </Button>
                )}
                
              </Stack>
            </Grid>
            </Stack>
           
          
          {active === 1 && (

            <Stack direction={"row"}>
              <Button
                sx={{

                  borderRadius: "0px",
                  borderBottom: eventActive === 0 ? "2px solid black" : "2px solid transperant",
                  color: `${theme.palette.icon.main}`,           
                }}
                
                onClick={() => setEventActive(0)}
              >
                <Typography sx={{
                  m:1,
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", sm: "1.15rem" },
                  }}
                >
                   Kurduklarım
                </Typography>

              </Button>

              <Button
                sx={{
                  borderRadius: "0px",
                  borderBottom: eventActive === 1 ? "2px solid black" : "2px solid transperant",
                  color: `${theme.palette.icon.main}`,
                }}
                onClick={() => setEventActive(1)}
              >
               <Typography sx={{
                  m:1,
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", sm: "1.15rem" },
                  }}
                >
                   Gideceklerim
                </Typography>
              </Button>
            </Stack>
          )}





        <EventCreateDialog
          open = {IsEventCreateDialogOpen}
          onClose={handleEventCreateDialogClose}
        />

        </Container>



    )
}

