import { Box } from "@mui/material";
import { Spinner } from "@phosphor-icons/react/dist/ssr/Spinner";
import PostCreateDialog from "../../components/PostCreateDialog";
import type { FieldValues } from "react-hook-form";

export default function FeedPage() {
  return (
    <>
      <Spinner size={32} />
      <PostCreateDialog
        open={true}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSubmit={function (data: FieldValues): void {
          throw new Error("Function not implemented.");
        }}
      />
      <Box sx={{ height: "200vh" }}>AuthPage</Box>
    </>
  );
}
