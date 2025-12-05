import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Skeleton,
  Box,
} from "@mui/material";

const PostCardSkeleton = () => {
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 4,
        mb: 4,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
        }
        action={
          <Skeleton
            animation="wave"
            variant="circular"
            width={32}
            height={32}
          />
        }
        title={
          <Skeleton
            animation="wave"
            height={16}
            width="40%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={12} width="25%" />}
      />

      <CardContent sx={{ pt: 0, pb: 1 }}>
        <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" height={14} width="80%" />
      </CardContent>

      <Skeleton
        sx={{ height: 400, width: "100%" }}
        animation="wave"
        variant="rectangular"
      />

      <CardActions
        disableSpacing
        sx={{ padding: 2, justifyContent: "space-between" }}
      >
        <Box display="flex" gap={1}>
          <Skeleton
            animation="wave"
            variant="rounded"
            width={60}
            height={36}
            sx={{ borderRadius: 50 }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width={60}
            height={36}
            sx={{ borderRadius: 50 }}
          />
        </Box>
      </CardActions>
    </Card>
  );
};

export default PostCardSkeleton;
