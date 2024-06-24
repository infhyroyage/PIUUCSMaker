import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useRecoilValue } from "recoil";
import AdjustBlockDialog from "./components/dialog/AdjustBlockDialog";
import { AggregateDialog } from "./components/dialog/AggregateDialog";
import EditBlockDialog from "./components/dialog/EditBlockDialog";
import NewUCSDialog from "./components/dialog/NewUCSDialog";
import MenuBar from "./components/menu/MenuBar";
import MenuDrawer from "./components/menu/MenuDrawer";
import SuccessSnackbar from "./components/snackbar/SuccessSnackbar";
import UserErrorSnackbar from "./components/snackbar/UserErrorSnackbar";
import ReadyUCS from "./components/workspace/ReadyUCS";
import WorkSpace from "./components/workspace/WorkSpace";
import { ucsNameState } from "./services/atoms";

function App() {
  const ucsName = useRecoilValue<string | null>(ucsNameState);

  // Activate Google Analytics only in production mode
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      ReactGA.initialize("G-XLZYQZ4979");
    }
  }, []);

  return (
    <>
      <MenuBar />
      <MenuDrawer />
      {ucsName === null ? <ReadyUCS /> : <WorkSpace />}
      <AggregateDialog />
      <AdjustBlockDialog />
      <EditBlockDialog />
      <NewUCSDialog />
      <SuccessSnackbar />
      <UserErrorSnackbar />
    </>
  );
}

export default App;
