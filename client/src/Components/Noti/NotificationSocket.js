import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../../Context/SocketContext";
function NotificationSocket() {
  const { operatingStatus } = useContext(SocketContext);

  return (
    <div
      className={`fixed items-start h-2/3 overflow-hidden z-50 flex justify-center w-1/3 bg-white right-3 top-24 rounded-md`}
    >
      <div className="flex flex-col border-b w-full p-4">
        <h1 className="uppercase font-semibold text-lg tracking-wider">
          Thông báo
        </h1>
        <div className="flex items-center gap-x-3">
          <div
            className={`${operatingStatus === "Online" ? "bg-green-500" : "bg-red-600"} rounded-full w-3 h-3 text-center text-white text-xs font-semibold`}
          ></div>
          <h4 className="text-sm">{operatingStatus}</h4>
        </div>
      </div>
    </div>
  );
}
export function Notification() {
  const { socket } = useContext(SocketContext);

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("responseData", (message) => {
        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      });
    }

    return () => {
      if (socket) {
        socket.off("responseData");
      }
    };
  }, [socket]);

  return (
    <div
      className={`${showNotification ? "h-20 w-80 z-50 opacity-100" : "z-0 h-0 w-0 opacity-0"} border-cyan-500 border duration-700 transition-all fixed items-start  overflow-hidden  flex justify-center  bg-white right-[50px] top-24 rounded-md`}
    >
      <div className="flex flex-col w-full p-1">
        <h1 className="font-semibold text-base tracking-wider">
          Bạn có thông báo mới.
        </h1>
        <div className="flex gap-x-3 flex-col">
          <h5>Chức năng</h5>
          <p className="line-clamp-1 ml-3">Nội dung</p>
        </div>
      </div>
    </div>
  );
}
export default NotificationSocket;
