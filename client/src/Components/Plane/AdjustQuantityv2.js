import { useEffect, useContext, useState } from "react";
import { CONTEXT } from "../../Context/ContextGlobal.js";
import { User, Baby, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AdjustQuantityv2({
  totalEconomySeats = 100,
  totalBusinessSeats = 70,
  passengerChooseSeats = [2, 3],
  objDeparture,
  setSelectedDepartureAirport,
  setPassengerChooseDeparture,
  objReturn,
  countDepartureFlights,
  countReturnFlights,
}) {
  const { showNotification } = useContext(CONTEXT);
  // Tính toán số cột dựa trên tổng số ghế
  const calculateColumns = (totalSeats) => {
    // Giả sử mỗi hàng có tối đa 6 ghế (3 ghế mỗi bên + lối đi)
    const maxSeatsPerRow = 6;
    const rows = Math.ceil(totalSeats / maxSeatsPerRow);
    return Math.ceil(totalSeats / rows);
  };

  const businessColumns = calculateColumns(totalBusinessSeats);
  const economyColumns = calculateColumns(totalEconomySeats);
  const maxColumns = Math.max(businessColumns, economyColumns);

  const generateSeats = () => {
    const seats = [];
    const maxSeatsPerRow = 6; // Số ghế tối đa mỗi hàng (3 ghế mỗi bên)
    const seatsPerSide = maxSeatsPerRow / 2; // Số ghế mỗi bên (3 ghế)

    // Tính số hàng cho mỗi loại ghế
    const businessRows = Math.ceil(totalBusinessSeats / maxSeatsPerRow);
    const economyRows = Math.ceil(totalEconomySeats / maxSeatsPerRow);
    const totalRows = businessRows + economyRows;

    let businessSeatCount = 0;
    let economySeatCount = 0;

    // Tạo tất cả các hàng ghế
    for (let row = 0; row < totalRows; row++) {
      const rowSeats = [];
      const isBusinessClass = row < businessRows;

      // Tạo ghế bên trái
      for (let col = 0; col < seatsPerSide; col++) {
        if (isBusinessClass && businessSeatCount < totalBusinessSeats) {
          rowSeats.push({
            id: `${row + 1}${String.fromCharCode(65 + col)}`,
            booked: false,
            type: "business",
            passengerType: null,
          });
          businessSeatCount++;
        } else if (!isBusinessClass && economySeatCount < totalEconomySeats) {
          rowSeats.push({
            id: `${row + 1}${String.fromCharCode(65 + col)}`,
            booked: false,
            type: "economy",
            passengerType: null,
          });
          economySeatCount++;
        } else {
          rowSeats.push(null);
        }
      }

      // Thêm lối đi ở giữa
      rowSeats.push(null);

      // Tạo ghế bên phải
      for (let col = 0; col < seatsPerSide; col++) {
        if (isBusinessClass && businessSeatCount < totalBusinessSeats) {
          rowSeats.push({
            id: `${row + 1}${String.fromCharCode(65 + col + seatsPerSide)}`,
            booked: false,
            type: "business",
            passengerType: null,
          });
          businessSeatCount++;
        } else if (!isBusinessClass && economySeatCount < totalEconomySeats) {
          rowSeats.push({
            id: `${row + 1}${String.fromCharCode(65 + col + seatsPerSide)}`,
            booked: false,
            type: "economy",
            passengerType: null,
          });
          economySeatCount++;
        } else {
          rowSeats.push(null);
        }
      }
      seats.push(rowSeats);
    }

    return seats;
  };

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [clickedSeat, setClickedSeat] = useState(null);

  useEffect(() => {
    setSeats(generateSeats());
  }, [totalEconomySeats, totalBusinessSeats]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickedSeat && !event.target.closest(".seat-container")) {
        setClickedSeat(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickedSeat]);

  const handleSeatClick = (rowIdx, colIdx) => {
    const newSeats = [...seats];
    const seat = newSeats[rowIdx][colIdx];

    if (seat) {
      const seatId = seat.id;
      const newSelectedSeats = new Set(selectedSeats);
      const totalPassengers = passengerChooseSeats[0] + passengerChooseSeats[1];
      const adultCount = passengerChooseSeats[0];
      const childCount = passengerChooseSeats[1];

      // Hàm kiểm tra ghế kề bên
      const getAdjacentSeats = (row, col) => {
        const adjacent = [];
        if (col > 0 && newSeats[row][col - 1])
          adjacent.push(newSeats[row][col - 1]);
        if (col < newSeats[row].length - 1 && newSeats[row][col + 1])
          adjacent.push(newSeats[row][col + 1]);
        return adjacent;
      };

      // Hàm đếm số trẻ em ngồi cạnh một người lớn
      const countChildrenNearAdult = (row, col) => {
        const adjacentSeats = getAdjacentSeats(row, col);
        return adjacentSeats.filter(
          (seat) =>
            seat &&
            seat.booked &&
            selectedSeats.has(seat.id) &&
            seat.passengerType === "child"
        ).length;
      };

      if (selectedSeats.has(seatId)) {
        // Hủy chọn ghế
        newSelectedSeats.delete(seatId);
        newSeats[rowIdx][colIdx] = {
          ...seat,
          booked: false,
          passengerType: null,
        };
        setSelectedSeats(newSelectedSeats);
        setSeats(newSeats);
      } else {
        // Kiểm tra số lượng ghế đã chọn
        if (newSelectedSeats.size >= totalPassengers) {
          showNotification(
            `Bạn chỉ có thể chọn tối đa ${totalPassengers} ghế`,
            "Error"
          );
          return;
        }

        // Kiểm tra vị trí ngồi của trẻ em
        const adjacentSeats = getAdjacentSeats(rowIdx, colIdx);
        const hasAdultNearby = adjacentSeats.some(
          (seat) =>
            seat &&
            seat.booked &&
            selectedSeats.has(seat.id) &&
            seat.passengerType === "adult"
        );

        // Nếu đang chọn ghế cho trẻ em
        if (newSelectedSeats.size >= adultCount) {
          if (!hasAdultNearby) {
            showNotification("Trẻ em phải ngồi cạnh người lớn", "Error");
            return;
          }

          // Kiểm tra số trẻ em đã ngồi cạnh người lớn
          const adultSeat = adjacentSeats.find(
            (seat) =>
              seat &&
              seat.booked &&
              selectedSeats.has(seat.id) &&
              seat.passengerType === "adult"
          );
          if (adultSeat) {
            const childrenCount = countChildrenNearAdult(
              rowIdx,
              adjacentSeats.indexOf(adultSeat)
            );
            if (childrenCount >= 2) {
              showNotification(
                "Một người lớn chỉ được ngồi cạnh tối đa 2 trẻ em",
                "Error"
              );
              return;
            }
          }
        }

        // Chọn ghế
        newSelectedSeats.add(seatId);
        newSeats[rowIdx][colIdx] = {
          ...seat,
          booked: true,
          passengerType:
            newSelectedSeats.size <= adultCount ? "adult" : "child",
        };
        setSelectedSeats(newSelectedSeats);
        setSeats(newSeats);
      }
    }
  };

  const handlePassengerTypeSelect = (rowIdx, colIdx, type) => {
    const newSeats = [...seats];
    const seat = newSeats[rowIdx][colIdx];

    if (seat) {
      const seatId = seat.id;
      const newSelectedSeats = new Set(selectedSeats);
      const adultCount = passengerChooseSeats[0];
      const childCount = passengerChooseSeats[1];

      // Đếm số lượng người lớn và trẻ em đã chọn
      const currentAdultCount = Array.from(newSelectedSeats).filter((id) => {
        const [row, col] = findSeatPosition(id);
        return seats[row][col]?.passengerType === "adult";
      }).length;

      const currentChildCount = Array.from(newSelectedSeats).filter((id) => {
        const [row, col] = findSeatPosition(id);
        return seats[row][col]?.passengerType === "child";
      }).length;

      // Hàm kiểm tra ghế kề bên
      const getAdjacentSeats = (row, col) => {
        const adjacent = [];
        if (col > 0 && newSeats[row][col - 1])
          adjacent.push(newSeats[row][col - 1]);
        if (col < newSeats[row].length - 1 && newSeats[row][col + 1])
          adjacent.push(newSeats[row][col + 1]);
        return adjacent;
      };

      // Hàm kiểm tra xem có người lớn nào gần đó không
      const hasAdultNearby = (row, col) => {
        const adjacentSeats = getAdjacentSeats(row, col);
        return adjacentSeats.some(
          (seat) =>
            seat &&
            seat.booked &&
            selectedSeats.has(seat.id) &&
            seat.passengerType === "adult"
        );
      };

      // Hàm đếm số trẻ em ngồi cạnh một người lớn
      const countChildrenNearAdult = (row, col) => {
        const adjacentSeats = getAdjacentSeats(row, col);
        return adjacentSeats.filter(
          (seat) =>
            seat &&
            seat.booked &&
            selectedSeats.has(seat.id) &&
            seat.passengerType === "child"
        ).length;
      };

      // Hàm kiểm tra xem có thể thêm trẻ em vào vị trí này không
      const canAddChild = (row, col) => {
        const rowSeats = newSeats[row];
        const currentSeat = rowSeats[col];

        // Kiểm tra xem vị trí hiện tại có phải là ô null không
        if (currentSeat === null) return false;

        // Lấy các ghế kề bên
        const leftSeat = col > 0 ? rowSeats[col - 1] : null;
        const rightSeat = col < rowSeats.length - 1 ? rowSeats[col + 1] : null;

        // Kiểm tra các trường hợp hợp lệ
        const isValidPosition = () => {
          // Kiểm tra bên trái
          if (leftSeat) {
            // Nếu bên trái là người lớn
            if (leftSeat.passengerType === "adult") {
              return true;
            }
            // Nếu bên trái là trẻ em và bên trái nữa là người lớn
            if (
              leftSeat.passengerType === "child" &&
              col > 1 &&
              rowSeats[col - 2]?.passengerType === "adult"
            ) {
              return true;
            }
          }

          // Kiểm tra bên phải
          if (rightSeat) {
            // Nếu bên phải là người lớn
            if (rightSeat.passengerType === "adult") {
              return true;
            }
            // Nếu bên phải là trẻ em và bên phải nữa là người lớn
            if (
              rightSeat.passengerType === "child" &&
              col < rowSeats.length - 2 &&
              rowSeats[col + 2]?.passengerType === "adult"
            ) {
              return true;
            }
          }

          return false;
        };

        return isValidPosition();
      };

      // Hàm tìm người lớn gần nhất có thể nhận thêm trẻ em
      const findAdultForChild = (row, col) => {
        const adjacentSeats = getAdjacentSeats(row, col);
        return adjacentSeats.find(
          (seat) =>
            seat &&
            seat.booked &&
            selectedSeats.has(seat.id) &&
            seat.passengerType === "adult" &&
            countChildrenNearAdult(row, adjacentSeats.indexOf(seat)) < 2
        );
      };

      // Thêm hàm này vào trong handlePassengerTypeSelect, trước khi xử lý các trường hợp type
      const cancelSeatAndRelatedChildren = (row, col) => {
        const seatToCancel = newSeats[row][col];
        if (seatToCancel) {
          // Hủy ghế hiện tại
          newSelectedSeats.delete(seatToCancel.id);
          newSeats[row][col] = {
            ...seatToCancel,
            booked: false,
            passengerType: null,
          };

          const rowSeats = newSeats[row];

          if (seatToCancel.passengerType === "adult") {
            // Nếu là ghế người lớn, kiểm tra và hủy các ghế trẻ em liên quan

            // Kiểm tra ghế bên trái
            if (col > 0 && rowSeats[col - 1]?.passengerType === "child") {
              // Hủy ghế trẻ em bên trái
              newSelectedSeats.delete(rowSeats[col - 1].id);
              newSeats[row][col - 1] = {
                ...rowSeats[col - 1],
                booked: false,
                passengerType: null,
              };

              // Kiểm tra ghế bên trái nữa (nếu có trẻ em ngồi cách 1 ô)
              if (col > 1 && rowSeats[col - 2]?.passengerType === "child") {
                newSelectedSeats.delete(rowSeats[col - 2].id);
                newSeats[row][col - 2] = {
                  ...rowSeats[col - 2],
                  booked: false,
                  passengerType: null,
                };
              }
            }

            // Kiểm tra ghế bên phải
            if (
              col < rowSeats.length - 1 &&
              rowSeats[col + 1]?.passengerType === "child"
            ) {
              // Hủy ghế trẻ em bên phải
              newSelectedSeats.delete(rowSeats[col + 1].id);
              newSeats[row][col + 1] = {
                ...rowSeats[col + 1],
                booked: false,
                passengerType: null,
              };

              // Kiểm tra ghế bên phải nữa (nếu có trẻ em ngồi cách 1 ô)
              if (
                col < rowSeats.length - 2 &&
                rowSeats[col + 2]?.passengerType === "child"
              ) {
                newSelectedSeats.delete(rowSeats[col + 2].id);
                newSeats[row][col + 2] = {
                  ...rowSeats[col + 2],
                  booked: false,
                  passengerType: null,
                };
              }
            }
          } else if (seatToCancel.passengerType === "child") {
            // Nếu là ghế trẻ em, kiểm tra xem có phải là trẻ em ngồi cách người lớn 1 ô không
            const isChildOneSeatAway = () => {
              // Kiểm tra bên trái
              if (col > 1 && rowSeats[col - 2]?.passengerType === "adult") {
                return true;
              }
              // Kiểm tra bên phải
              if (
                col < rowSeats.length - 2 &&
                rowSeats[col + 2]?.passengerType === "adult"
              ) {
                return true;
              }
              return false;
            };

            // Nếu là trẻ em ngồi cách người lớn 1 ô, chỉ hủy ghế hiện tại
            if (isChildOneSeatAway()) {
              return;
            }

            // Nếu không phải trẻ em ngồi cách người lớn 1 ô, kiểm tra và hủy các ghế trẻ em liên quan
            // Kiểm tra ghế bên trái
            if (col > 0 && rowSeats[col - 1]?.passengerType === "child") {
              newSelectedSeats.delete(rowSeats[col - 1].id);
              newSeats[row][col - 1] = {
                ...rowSeats[col - 1],
                booked: false,
                passengerType: null,
              };
            }

            // Kiểm tra ghế bên phải
            if (
              col < rowSeats.length - 1 &&
              rowSeats[col + 1]?.passengerType === "child"
            ) {
              newSelectedSeats.delete(rowSeats[col + 1].id);
              newSeats[row][col + 1] = {
                ...rowSeats[col + 1],
                booked: false,
                passengerType: null,
              };
            }
          }
        }
      };

      if (type === "adult") {
        // Kiểm tra số lượng người lớn
        if (currentAdultCount >= adultCount && !selectedSeats.has(seatId)) {
          showNotification("Đã đủ số lượng người lớn", "Error");
          return;
        }

        // Cập nhật trạng thái ghế
        if (selectedSeats.has(seatId)) {
          // Hủy chọn ghế người lớn và các ghế trẻ em liên quan
          cancelSeatAndRelatedChildren(rowIdx, colIdx);
        } else {
          // Chọn ghế cho người lớn
          newSelectedSeats.add(seatId);
          newSeats[rowIdx][colIdx] = {
            ...seat,
            booked: true,
            passengerType: "adult",
          };
        }
      } else if (type === "child") {
        // Kiểm tra số lượng trẻ em
        if (currentChildCount >= childCount && !selectedSeats.has(seatId)) {
          showNotification("Đã đủ số lượng trẻ em", "Error");
          return;
        }

        // Kiểm tra xem có thể thêm trẻ em vào vị trí này không
        if (!canAddChild(rowIdx, colIdx)) {
          showNotification("Không thể thêm trẻ em vào vị trí này", "Error");
          return;
        }

        // Cập nhật trạng thái ghế
        if (selectedSeats.has(seatId)) {
          // Hủy chọn ghế trẻ em và các ghế trẻ em liên quan
          cancelSeatAndRelatedChildren(rowIdx, colIdx);
        } else {
          // Chọn ghế cho trẻ em
          newSelectedSeats.add(seatId);
          newSeats[rowIdx][colIdx] = {
            ...seat,
            booked: true,
            passengerType: "child",
          };
        }
      } else {
        // Hủy chọn ghế
        if (selectedSeats.has(seatId)) {
          cancelSeatAndRelatedChildren(rowIdx, colIdx);
        }
      }

      setSelectedSeats(newSelectedSeats);
      setSeats(newSeats);
    }
  };

  const findSeatPosition = (seatId) => {
    for (let row = 0; row < seats.length; row++) {
      for (let col = 0; col < seats[row].length; col++) {
        if (seats[row][col]?.id === seatId) {
          return [row, col];
        }
      }
    }
    return [-1, -1];
  };

  return (
    <div className="fixed z-20 flex items-center justify-center w-full h-screen bg-white/10 backdrop-brightness-75">
      <div className="absolute z-20 w-full h-full"></div>
      <div className="absolute z-20 m-auto max-h-[80%] h-fit md:w-[45%] w-11/12 rounded-lg p-4 top-24 overflow-y-auto bg-white">
        <div className="text-center font-sans p-5">
          <h1 className="text-2xl font-bold mb-5">Sơ đồ ghế máy bay</h1>
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-2">
              {seats.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-center gap-2">
                  {row.map((seat, colIdx) =>
                    seat ? (
                      <div
                        key={seat.id}
                        className="relative seat-container"
                        onClick={() =>
                          setClickedSeat(
                            clickedSeat === seat.id ? null : seat.id
                          )
                        }>
                        <AnimatePresence>
                          {clickedSeat === seat.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute -left-1/2 bottom-full -translate-x-1/2 mb-1 bg-white p-0 overflow-hidden rounded-lg shadow-lg z-30 border border-gray-200">
                              {!seat.booked ? (
                                <div className="flex w-[90px]">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePassengerTypeSelect(
                                        rowIdx,
                                        colIdx,
                                        "adult"
                                      );
                                      setClickedSeat(null);
                                    }}
                                    className="w-1/2 h-8 hover:bg-gray-100 transition-colors flex items-center justify-center">
                                    <User size={18} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePassengerTypeSelect(
                                        rowIdx,
                                        colIdx,
                                        "child"
                                      );
                                      setClickedSeat(null);
                                    }}
                                    className="w-1/2 h-8 hover:bg-gray-100 transition-colors flex items-center justify-center">
                                    <Baby size={18} />
                                  </motion.button>
                                </div>
                              ) : (
                                <div className="flex w-[135px]">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePassengerTypeSelect(
                                        rowIdx,
                                        colIdx,
                                        "adult"
                                      );
                                      setClickedSeat(null);
                                    }}
                                    className={`w-1/3 h-8 transition-colors flex items-center justify-center ${
                                      seat.passengerType === "adult"
                                        ? "bg-blue-100"
                                        : "hover:bg-gray-100"
                                    }`}>
                                    <User size={18} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePassengerTypeSelect(
                                        rowIdx,
                                        colIdx,
                                        "child"
                                      );
                                      setClickedSeat(null);
                                    }}
                                    className={`w-1/3 h-8 transition-colors flex items-center justify-center ${
                                      seat.passengerType === "child"
                                        ? "bg-blue-100"
                                        : "hover:bg-gray-100"
                                    }`}>
                                    <Baby size={18} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePassengerTypeSelect(
                                        rowIdx,
                                        colIdx,
                                        null
                                      );
                                      setClickedSeat(null);
                                    }}
                                    className="w-1/3 h-8 hover:bg-red-100 transition-colors flex items-center justify-center">
                                    <X size={18} />
                                  </motion.button>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`w-10 h-10 flex items-center justify-center border rounded cursor-pointer text-sm transition-all duration-200 select-none
                          ${
                            seat.booked
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : seat.type === "business"
                                ? "bg-yellow-300 hover:bg-yellow-400"
                                : "bg-green-300 hover:bg-green-400"
                          }`}>
                          {seat.booked ? (
                            seat.passengerType === "adult" ? (
                              <User size={20} />
                            ) : (
                              <Baby size={20} />
                            )
                          ) : (
                            seat.id
                          )}
                        </motion.div>
                      </div>
                    ) : (
                      <div
                        key={`aisle-${rowIdx}-${colIdx}`}
                        className="w-10 h-10 bg-gray-100"></div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex gap-5 justify-center">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-green-300 inline-block"></span>
              <span>Ghế phổ thông (Economy)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-yellow-300 inline-block"></span>
              <span>Ghế thương gia (Business)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-red-500 inline-block"></span>
              <span>Ghế đã đặt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdjustQuantityv2;
