import { useContext, useEffect, useState } from "react";
import { CONTEXT } from "../Context/ContextAdmin";

const SuaThongTinVe = ({ isVisible, onClose, ticket, onSave }) => {
  const { userObj } = useContext(CONTEXT);
  if (!userObj) {
    window.location.href = "/";
  }

  const [updatedTicket, setUpdatedTicket] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ticket) {
      setUpdatedTicket(ticket.HanhLy);
    }
  }, [ticket]);

  const handleSave = () => {
    const hanhLyValue = parseInt(updatedTicket, 10);
    if (isNaN(hanhLyValue) || hanhLyValue <= 0) {
      setError("Gía trị hnahf lý không hợp lệ");
      return;
    }
    if (hanhLyValue > 30) {
      setError("Hành lý không được vượt quá 30kg.");
      return;
    }
    setError("");
    onSave({ ...ticket, HanhLy: `${hanhLyValue}kg` });
    onClose();
  };

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="justify-center bg-white p-6 rounded-lg w-1/2 flex-col-reverse">
        <h2 className="text-center text-xl font-bold mb-4 text-blue-600">
          SỬA THÔNG TIN VÉ
        </h2>
        <div className="flex">
          <label className="block font-medium p-2">Hành Lý :</label>
          <input
            type="text"
            value={updatedTicket}
            onChange={(e) => setUpdatedTicket(e.target.value)}
            className="w-[100px] border border-gray-300 p-2 rounded-md"
          />
        </div>
        {error && <p className="text-red-500 p-2">{error}</p>}
        <div className="flex gap-5">
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};
export default SuaThongTinVe;
