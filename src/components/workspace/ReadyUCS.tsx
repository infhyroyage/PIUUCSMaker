import { useSetRecoilState } from "recoil";
import useUploadingUCS from "../../hooks/useUploadingUCS";
import { isOpenedNewUCSDialogState } from "../../services/atoms";
import { MENU_BAR_HEIGHT } from "../../services/styles";

function ReadyUCS() {
  const setIsOpenedNewUCSDialog = useSetRecoilState<boolean>(
    isOpenedNewUCSDialogState
  );

  const { isUploadingUCS, onUploadUCS } = useUploadingUCS();

  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      style={{
        height: `calc(100vh - ${MENU_BAR_HEIGHT}px)`,
        marginLeft: `${MENU_BAR_HEIGHT}px`,
      }}
    >
      <button
        className="btn btn-primary"
        disabled={isUploadingUCS}
        onClick={() => setIsOpenedNewUCSDialog(true)}
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
