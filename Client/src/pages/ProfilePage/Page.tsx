import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Card,
  LinearProgress,
  Grid,
  Stack,
  Chip,
  useTheme,
  Fade,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { CalendarDots, MapPin } from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import { apiUrl } from "../../shared/api/ApiClient";
import { getInitials } from "../EditProfilePage/Page";
import PostCard from "../../components/SinglePostCard";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";
import { useEffect } from "react";
import {
  selectAllUserPosts,
  userMeposts,
} from "../../features/posts/store/UserPostsSlice";
import PostCardSkeleton from "../../components/PostCardSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";

interface QuickAction {
  label: string;
  showIf: boolean;
}

export default function ProfilePage() {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    { label: "Mahallenizi doğrulayınız", showIf: !user?.isLocationVerified },
    { label: "Profil fotosu ekle", showIf: user?.profilePhotoUrl === null },
    { label: "İlk gönderini yayınla", showIf: true },
    { label: "Kapak fotoğrafı ekle", showIf: user?.coverPhotoUrl === null },
  ];
  const visibleActions = actions.filter((action) => action.showIf);

  const totalTasks = actions.length;
  const completedTasks = totalTasks - visibleActions.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;
  const ND_DARK = theme.palette.icon.main;

  const dispatch = useAppDispatch();

  const userMePosts = useSelector((state: RootState) =>
    selectAllUserPosts(state)
  );

  const { status, nextPage, hasMore } = useSelector(
    (state: RootState) => state.userPosts
  );

  useEffect(() => {
    if (userMePosts.length === 0 && status == "idle") {
      dispatch(userMeposts(1));
    }
  }, [dispatch, userMePosts.length, status]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ px: { xs: 0, md: 2 }, width: "%100" }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            mb: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: 100,
              backgroundImage: user?.coverPhotoUrl
                ? `url(${apiUrl}/user-coverphoto/${user.coverPhotoUrl})`
                : "linear-gradient(to right, #dbe2ef, #cbd5e1)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />

          <Box sx={{ px: 2, pb: 2 }}>
            <Avatar
              src={`${apiUrl}user-profilephoto/${user?.profilePhotoUrl}`}
              sx={{
                width: 120,
                height: 120,
                bgcolor: "#c4cdd5",
                fontSize: 50,
                color: `${theme.palette.icon.main}`,
                mt: "-40px",
                border: "4px solid white",
                position: "relative",
                zIndex: 1,
              }}
            >
              {getInitials(user?.fullName)}
            </Avatar>

            <Box sx={{ mt: 1 }}>
              <Typography variant="h5" fontWeight="bold" color={ND_DARK}>
                {user?.fullName}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {user?.biography}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  color: "text.secondary",
                  gap: 1,
                }}
              >
                <MapPin size={23} color={theme.palette.icon.main} />
                <Typography
                  variant="caption"
                  fontWeight={"bold"}
                  sx={{ fontSize: "0.8rem" }}
                >
                  {user?.neighborhood}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                onClick={() => navigate("/profile-edit")}
                variant="contained"
                sx={{
                  bgcolor: ND_DARK,
                  textTransform: "none",
                  borderRadius: 5,
                  px: 3,
                }}
              >
                Profili düzenle
              </Button>
            </Stack>
          </Box>
        </Card>

        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              mb: 1,
            }}
          >
            <Typography variant="h6" fontWeight="bold" color={ND_DARK}>
              Kontrol Paneli
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Yalnızca senin tarafından görülebilir
            </Typography>
          </Box>

          <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, p: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" fontWeight="bold">
                Profil İlerlemesi: {progressPercentage}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: `${theme.palette.icon.background}`,
                "& .MuiLinearProgress-bar": { bgcolor: ND_DARK },
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 2,
                overflowX: "auto",
                pb: 1,
                "&::-webkit-scrollbar": { display: "none" },
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
              }}
            >
              {visibleActions.length > 0 ? (
                visibleActions.map((item, i) => (
                  <Fade in={true} key={item.label}>
                    <Chip
                      key={i}
                      label={item.label}
                      variant="outlined"
                      onClick={() => console.log(item.label)}
                      sx={{
                        borderRadius: 2,
                        borderColor: "#ddd",
                        bgcolor: `${theme.palette.icon.background}`,
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    />
                  </Fade>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ mt: 2, fontWeight: "bold" }}
                >
                  🎉 Tebrikler! Profiliniz tamamlandı.
                </Typography>
              )}
            </Stack>
          </Card>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CalendarDots />}
                sx={{
                  justifyContent: "flex-start",
                  color: ND_DARK,
                  borderColor: "#ddd",
                  borderRadius: 3,
                  py: 1.5,
                  textTransform: "none",
                }}
              >
                Etkinlikler
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={ND_DARK}
            sx={{ mb: 1 }}
          >
            Gönderiler
          </Typography>

          {status === "pendingUserMeposts" ? (
            <Stack spacing={3}>
              <PostCardSkeleton />
              <PostCardSkeleton />
            </Stack>
          ) : userMePosts && userMePosts.length > 0 ? (
            <InfiniteScroll
              dataLength={userMePosts.length}
              next={() => dispatch(userMeposts(nextPage))}
              hasMore={hasMore}
              loader={
                <Stack spacing={3} sx={{ mt: 3, overflow: "hidden" }}>
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </Stack>
              }
              endMessage={
                <Typography
                  align="center"
                  color="text.secondary"
                  sx={{ py: 4, mb: 2 }}
                >
                  🎉 Tüm gönderileri gördünüz.
                </Typography>
              }
              // Sayfa kaydırması yerine belirli bir div içinde kaydırma yapacaksanız
              // scrollableTarget="id-of-div" kullanabilirsiniz. Şu an sayfa scroll'u kullanıyoruz.
              style={{ overflow: "visible" }} // Dropdown menülerin kesilmemesi için önemli!
            >
              <Stack spacing={3}>
                {userMePosts.map((post) => (
                  <PostCard key={post.postId} post={post} />
                ))}
              </Stack>
            </InfiniteScroll>
          ) : (
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                textAlign: "center",
                py: 4,
                px: 2,
                bgcolor: theme.palette.icon.background,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Henüz hiç gönderi yok
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Burası çok sessiz...
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: ND_DARK,
                  textTransform: "none",
                  borderRadius: 5,
                }}
              >
                Bir Gönderi Paylaş
              </Button>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
}
