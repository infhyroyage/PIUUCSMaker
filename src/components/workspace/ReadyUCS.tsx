import useNewUcsDialog from "../../hooks/useNewUcsDialog";
import useUploadingUCS from "../../hooks/useUploadingUCS";
import { NAVIGATION_BAR_HEIGHT } from "../../services/styles";

function ReadyUCS() {
  const { openNewUcsDialog } = useNewUcsDialog();
  const { isUploadingUCS, onUploadUCS } = useUploadingUCS();

  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      style={{
        height: `calc(100vh - ${NAVIGATION_BAR_HEIGHT}px)`,
        marginTop: `${NAVIGATION_BAR_HEIGHT}px`,
        marginLeft: `${NAVIGATION_BAR_HEIGHT}px`,
      }}
    >
      <button
        className="btn btn-primary"
        disabled={isUploadingUCS}
        onClick={openNewUcsDialog}
      >
        New UCS
      </button>
      <p>or</p>
      <label
        className={`btn btn-primary ${isUploadingUCS ? "btn-disabled" : ""}`}
      >
        {isUploadingUCS ? "Ready..." : "Upload UCS"}
        <input
          accept=".ucs"
          onChange={onUploadUCS}
          style={{ display: "none" }}
          type="file"
          disabled={isUploadingUCS}
        />
      </label>
    </div>
  );
}

export default ReadyUCS;
