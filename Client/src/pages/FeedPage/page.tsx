import { Box } from "@mui/material";
import { Spinner } from "@phosphor-icons/react/dist/ssr/Spinner";
import PostCreateDialog from "../../components/PostCreateDiaglog";

export default function FeedPage() {
  return (
    <>
      <Spinner size={32} />
      <PostCreateDialog
        open={true}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSubmit={function (data: { content: string; audience: string }): void {
          throw new Error("Function not implemented.");
        }}
        userName={""}
      />
      <Box sx={{ height: "200vh" }}>AuthPage</Box>
    </>
  );
}
