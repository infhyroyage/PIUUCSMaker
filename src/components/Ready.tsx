import { Box, Button } from "@mui/material";
import useOpenFile from "../hooks/useOpenFile";

function Ready() {
  const { isOpeningFile, handleOpenFile } = useOpenFile();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Button variant="contained" component="label" disabled={isOpeningFile}>
        {isOpeningFile ? "Opening..." : "Open UCS File"}
        <input
          type="file"
          accept=".ucs"
          style={{ display: "none" }}
          onChange={handleOpenFile}
        />
      </Button>
    </Box>
  );
}

export default Ready;
