import { Typography } from "@mui/material";
import { appInfo } from "../config/info";

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {appInfo.copyright}
    </Typography>
  );
}
