import { useState, useEffect, useContext } from "react";
import { CONTEXT } from "../Context/ContextAdmin.js";

const XoaChuyenBay = ({ isVisible, onClose, flight }) => {
  const { userObj } = useContext(CONTEXT);
  if (!userObj) {
    window.location.href = "/";
  }
  const [isId, setId] = useState(null);
  const { isDeleteDialogVisible } = useContext(CONTEXT);

  useEffect(() => {
    setId(flight);
  }, [flight, isDeleteDialogVisible]);

  const submitDeleteChuyenBay = async () => {
    console.log(isId);
    if (isId) {
      try {
        const response = await fetch(
<<<<<<< HEAD:admin_/src/Components/XoaChuyenBay.js
          `https://adminverold.vercel.app/api/delete/flight/${isId._id}`,
=======
          `https://travrel-server.vercel.app/api/delete/flight/${isId._id}`,
>>>>>>> mainv2:admin/src/Components/XoaChuyenBay.js
          {
            method: "DELETE", // Phương thức HTTP
            headers: {
              "Content-Type": "application/json", // Kiểu nội dung của request
            },
          }
        );

        if (!response.ok || !response) {
          throw new Error("Network response was not ok");
        }
        alert("Chuyến bay đã được xóa thành công!");
        onClose();
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    } else {
    }
  };

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 justify-center flex items-center z-50">
      <div className="justify-center bg-white p-6 rounded-lg w-1/2 flex-col">
        <h2 className="text-center text-xl font-bold mb-4 text-red-600">
          XÓA CHUYẾN BAY
        </h2>
        <p className="text-center mb-4">
          <strong>Bạn có chắc muốn xóa chuyến bay này không ?</strong>
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded font-medium mr-2"
          >
            Hủy
          </button>
          <button
            onClick={submitDeleteChuyenBay}
            className="bg-red-500 text-white px-4 py-2 rounded font-medium"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};
export default XoaChuyenBay;
