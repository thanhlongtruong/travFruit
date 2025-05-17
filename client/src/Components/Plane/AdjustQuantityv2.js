import { useEffect, useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { CONTEXT } from "../../Context/ContextGlobal.js";
import { User, Baby } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ItemFlight from "./ItemFlight.js";

function AdjustQuantityv2({
  objDeparture,
  setSelectedDepartureAirport,
  setPassengerChooseDeparture,
  objReturn,
  countDepartureFlights,
  countReturnFlights,
}) {
  const { showNotification, handleReplacePriceAirport } = useContext(CONTEXT);

  const generateSeats = ({
    totalBusinessSeats,
    totalEconomySeats,
    bookedSeats,
  }) => {
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
          const seatId = `${row + 1}${String.fromCharCode(65 + col)}`;
          rowSeats.push({
            id: seatId,
            booked:
              bookedSeats?.soGheThuongGia_Booked?.includes(seatId) || false,
            type: "business",
            passengerType: null,
          });
          businessSeatCount++;
        } else if (!isBusinessClass && economySeatCount < totalEconomySeats) {
          const seatId = `${row + 1}${String.fromCharCode(65 + col)}`;
          rowSeats.push({
            id: seatId,
            booked:
              bookedSeats?.soGhePhoThong_Booked?.includes(seatId) || false,
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
          const seatId = `${row + 1}${String.fromCharCode(65 + col + seatsPerSide)}`;
          rowSeats.push({
            id: seatId,
            booked:
              bookedSeats?.soGheThuongGia_Booked?.includes(seatId) || false,
            type: "business",
            passengerType: null,
          });
          businessSeatCount++;
        } else if (!isBusinessClass && economySeatCount < totalEconomySeats) {
          const seatId = `${row + 1}${String.fromCharCode(65 + col + seatsPerSide)}`;
          rowSeats.push({
            id: seatId,
            booked:
              bookedSeats?.soGhePhoThong_Booked?.includes(seatId) || false,
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
  const [seatsReturn, setSeatsReturn] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [selectedSeatsReturn, setSelectedSeatsReturn] = useState(new Set());
  const [clickedSeat, setClickedSeat] = useState(null);
  const [clickedSeatReturn, setClickedSeatReturn] = useState(null);
  const [showPassengerInfo, setShowPassengerInfo] = useState(false);

  useEffect(() => {
    setSeats(
      generateSeats({
        totalEconomySeats: objDeparture?.[0]?.soGhePhoThong || 0,
        totalBusinessSeats: objDeparture?.[0]?.soGheThuongGia || 0,
        bookedSeats: objDeparture?.[2],
      })
    );

    setSeatsReturn(
      generateSeats({
        totalEconomySeats: objReturn?.[0]?.soGhePhoThong || 0,
        totalBusinessSeats: objReturn?.[0]?.soGheThuongGia || 0,
        bookedSeats: objReturn?.[2],
      })
    );
    console.log(objDeparture, objReturn, seats, seatsReturn);
  }, [objDeparture, objReturn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickedSeat && !event.target.closest(".seat-container")) {
        setClickedSeat(null);
      }
      if (clickedSeatReturn && !event.target.closest(".seat-container")) {
        setClickedSeatReturn(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickedSeat, clickedSeatReturn]);

  const handlePassengerTypeSelect = (
    rowIdx,
    colIdx,
    type,
    passengerCount,
    typeFlight
  ) => {
    let newSeats = [...seats];
    let newSelectedSeats = new Set(selectedSeats);

    if (typeFlight === "return") {
      newSeats = [...seatsReturn];
      newSelectedSeats = new Set(selectedSeatsReturn);
    }

    const seat = newSeats[rowIdx][colIdx];
    if (seat) {
      const seatId = seat.id;

      const adultCount = passengerCount?.[0];
      const childCount = passengerCount?.[1];

      // Đếm số lượng người lớn và trẻ em đã chọn
      const currentAdultCount = Array.from(newSelectedSeats).filter((id) => {
        const [row, col] = findSeatPosition(id);
        return newSeats[row][col]?.passengerType === "adult";
      }).length;

      const currentChildCount = Array.from(newSelectedSeats).filter((id) => {
        const [row, col] = findSeatPosition(id);
        return newSeats[row][col]?.passengerType === "child";
      }).length;

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

      // Thêm hàm này vào trong handlePassengerTypeSelect, trước khi xử lý các trường hợp type
      const cancelSeatAndRelatedChildren = (row, col) => {
        setShowPassengerInfo(false);
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
        if (currentAdultCount >= adultCount && !newSelectedSeats.has(seatId)) {
          showNotification("Đã đủ số lượng người lớn", "Warn");
          return;
        }

        // Cập nhật trạng thái ghế
        if (newSelectedSeats.has(seatId)) {
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
        if (currentChildCount >= childCount && !newSelectedSeats.has(seatId)) {
          showNotification("Đã đủ số lượng trẻ em", "Warn");
          return;
        }

        // Kiểm tra xem có thể thêm trẻ em vào vị trí này không
        if (!canAddChild(rowIdx, colIdx)) {
          showNotification("Không thể thêm trẻ em vào vị trí này", "Warn");
          return;
        }

        // Cập nhật trạng thái ghế
        if (newSelectedSeats.has(seatId)) {
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
        if (newSelectedSeats.has(seatId)) {
          cancelSeatAndRelatedChildren(rowIdx, colIdx);
        }
      }

      if (typeFlight === "return") {
        setSelectedSeatsReturn(newSelectedSeats);
        setSeatsReturn(newSeats);
      } else {
        setSelectedSeats(newSelectedSeats);
        setSeats(newSeats);
      }
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

  const stypeChooseSeat = [
    {
      color: "bg-green-300",
      name: "Phổ thông",
    },
    {
      color: "bg-yellow-300",
      name: "Thương gia",
    },
    {
      color: "bg-red-500",
      name: "Đã đặt",
    },
  ];

  const handleCalculatePrice = ({ passengerType, seatType, price }) => {
    if (passengerType === "adult") {
      if (seatType === "business") {
        return (
          new Intl.NumberFormat("vi-VN").format(
            Math.floor(handleReplacePriceAirport(price) * 1.5)
          ) + " VND"
        );
      } else {
        return objDeparture[0].gia;
      }
    } else if (passengerType === "child") {
      if (seatType === "business") {
        return (
          new Intl.NumberFormat("vi-VN").format(
            Math.floor(handleReplacePriceAirport(price) * 0.75 * 1.5)
          ) + " VND"
        );
      } else {
        return (
          new Intl.NumberFormat("vi-VN").format(
            Math.floor(handleReplacePriceAirport(price) * 0.75)
          ) + " VND"
        );
      }
    }
  };

  const handleShowPassengerInfo = () => {
    const adultSeatsCount = Array.from(selectedSeats).filter((seatId) => {
      const [row, col] = findSeatPosition(seatId);
      return seats[row]?.[col]?.passengerType === "adult";
    }).length;

    const childSeatsCount = Array.from(selectedSeats).filter((seatId) => {
      const [row, col] = findSeatPosition(seatId);
      return seats[row]?.[col]?.passengerType === "child";
    }).length;

    const passengerCount = objDeparture?.[1];
    const passengerCountReturn = objReturn?.[1];

    // Kiểm tra số lượng ghế đã chọn
    if (adultSeatsCount < passengerCount[0]) {
      showNotification(
        `Bạn cần chọn thêm ${passengerCount[0] - adultSeatsCount} ghế cho người lớn`,
        "Warn"
      );
      return;
    }

    if (childSeatsCount < passengerCount[1]) {
      showNotification(
        `Bạn cần chọn thêm ${passengerCount[1] - childSeatsCount} ghế cho trẻ em`,
        "Warn"
      );
      return;
    }

    if (objReturn?.[1]) {
      const adultSeatsCountReturn = Array.from(selectedSeatsReturn).filter(
        (seatId) => {
          const [row, col] = findSeatPosition(seatId);
          return seatsReturn[row]?.[col]?.passengerType === "adult";
        }
      ).length;

      const childSeatsCountReturn = Array.from(selectedSeatsReturn).filter(
        (seatId) => {
          const [row, col] = findSeatPosition(seatId);
          return seatsReturn[row]?.[col]?.passengerType === "child";
        }
      ).length;

      if (adultSeatsCountReturn < passengerCountReturn[0]) {
        showNotification(
          `Bạn cần chọn thêm ${passengerCountReturn[0] - adultSeatsCountReturn} ghế cho người lớn của chuyến bay khứ hồi`,
          "Warn"
        );
        return;
      }

      if (childSeatsCountReturn < passengerCountReturn[1]) {
        showNotification(
          `Bạn cần chọn thêm ${passengerCountReturn[1] - childSeatsCountReturn} ghế cho trẻ em của chuyến bay khứ hồi`,
          "Warn"
        );
        return;
      }
    }

    // Nếu đã chọn đủ số ghế, hiển thị form nhập thông tin
    setShowPassengerInfo(true);
  };

  // Thêm hàm tính tổng tiền
  const calculateTotalPrice = (type) => {
    let total = 0;
    Array.from(
      type === "departure" ? selectedSeats : selectedSeatsReturn
    ).forEach((seatId) => {
      const [row, col] = findSeatPosition(seatId);
      const seat = (type === "departure" ? seats : seatsReturn)[row]?.[col];
      if (seat) {
        const price = handleReplacePriceAirport(
          type === "departure" ? objDeparture[0].gia : objReturn[0].gia
        );
        if (seat.passengerType === "adult") {
          if (seat.type === "business") {
            total += Math.floor(price * 1.5);
          } else {
            total += price;
          }
        } else if (seat.passengerType === "child") {
          if (seat.type === "business") {
            total += Math.floor(price * 0.75 * 1.5);
          } else {
            total += Math.floor(price * 0.75);
          }
        }
      }
    });
    return new Intl.NumberFormat("vi-VN").format(total) + " VND";
  };

  return (
    <div className="font-mono overflow-hidden fixed inset-0 z-[101] grid grid-cols-1 md:grid-cols-6 p-5 gap-5 w-full h-full bg-white/10 backdrop-brightness-75">
      <AnimatePresence>
        {showPassengerInfo && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="overflow-y-auto col-start-1 bg-white col-span-2 rounded-lg shadow-lg">
            <div className="p-5 text-center uppercase ">
              <h2 className="text-xl font-bold mb-4">Thông tin hành khách</h2>
              <ComponentInputInformationPassenger
                airportDeparture={objDeparture[0]}
                airportReturn={objReturn?.[0]}
                oneWayFlight={true}
                selectedSeats={selectedSeats}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-full scrollbar rounded-lg col-span-2 col-start-3 overflow-y-auto bg-white">
        <div className="text-center pt-5">
          {Array.from({ length: objReturn ? 2 : 1 }, (_, i) => (
            <>
              <h1 className="text-2xl font-bold uppercase">
                Sơ đồ ghế máy bay
              </h1>
              <p
                className={`pt-1 ${i === 0 ? "departure-flight" : "return-flight"}`}>
                (Chuyến bay {i === 0 ? "đi" : "khứ hồi"})
              </p>
              <button
                onClick={() => {
                  const elements =
                    document.getElementsByClassName("return-flight");
                  if (elements.length > 0) {
                    // Scroll to each element with a small delay between them
                    Array.from(elements).forEach((element, index) => {
                      setTimeout(() => {
                        element.scrollIntoView({ behavior: "smooth" });
                      }, index * 500); // 500ms delay between each scroll
                    });
                  }
                }}
                className="sticky top-0 z-[300] bg-black/50 h-5 w-5 rounded-full"></button>
              <div className="mt-5 h-5 flex gap-5 justify-center mb-5 p-5 w-full bg-white">
                {stypeChooseSeat.map((item, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <span
                      className={`w-5 h-5 ${item.color} inline-block`}></span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>

              <div className="max-w-2xl mx-auto mb-5">
                <div className="flex flex-col gap-2">
                  {(i === 0 ? seats : seatsReturn).map((row, rowIdx) => (
                    <div key={rowIdx} className="flex justify-center gap-2">
                      {row.map((seat, colIdx) =>
                        seat ? (
                          <div
                            key={seat.id}
                            className="relative seat-container"
                            onClick={() => {
                              // Chỉ cho phép click nếu ghế không nằm trong danh sách đã đặt
                              if (
                                !(
                                  i === 0 ? objDeparture : objReturn
                                )?.[2]?.soGhePhoThong_Booked?.includes(
                                  seat.id
                                ) &&
                                !(
                                  i === 0 ? objDeparture : objReturn
                                )?.[2]?.soGheThuongGia_Booked?.includes(seat.id)
                              ) {
                                if (i === 0) {
                                  setClickedSeat(
                                    clickedSeat === seat.id ? null : seat.id
                                  );
                                } else if (i === 1) {
                                  setClickedSeatReturn(
                                    clickedSeatReturn === seat.id
                                      ? null
                                      : seat.id
                                  );
                                }
                              }
                            }}>
                            <AnimatePresence>
                              {(i === 0 ? clickedSeat : clickedSeatReturn) ===
                                seat.id &&
                                !(
                                  i === 0 ? objDeparture : objReturn
                                )?.[2]?.soGhePhoThong_Booked?.includes(
                                  seat.id
                                ) &&
                                !(
                                  i === 0 ? objDeparture : objReturn
                                )?.[2]?.soGheThuongGia_Booked?.includes(
                                  seat.id
                                ) && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute -left-2/3 bottom-full -translate-x-1/2 mb-1 bg-white p-0 overflow-hidden rounded-lg shadow-lg z-30 border border-gray-200">
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
                                              "adult",
                                              i === 0
                                                ? objDeparture?.[1]
                                                : objReturn?.[1],
                                              i === 0 ? "departure" : "return"
                                            );
                                            i === 0
                                              ? setClickedSeat(null)
                                              : setClickedSeatReturn(null);
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
                                              "child",
                                              i === 0
                                                ? objDeparture?.[1]
                                                : objReturn?.[1],
                                              i === 0 ? "departure" : "return"
                                            );
                                            i === 0
                                              ? setClickedSeat(null)
                                              : setClickedSeatReturn(null);
                                          }}
                                          className="w-1/2 h-8 hover:bg-gray-100 transition-colors flex items-center justify-center">
                                          <Baby size={18} />
                                        </motion.button>
                                      </div>
                                    ) : (
                                      <div className="flex w-[90px]">
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handlePassengerTypeSelect(
                                              rowIdx,
                                              colIdx,
                                              "adult",
                                              i === 0
                                                ? objDeparture?.[1]
                                                : objReturn?.[1],
                                              i === 0 ? "departure" : "return"
                                            );
                                            i === 0
                                              ? setClickedSeat(null)
                                              : setClickedSeatReturn(null);
                                          }}
                                          className={`w-1/2 h-8 transition-colors flex items-center justify-center ${
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
                                              "child",
                                              i === 0
                                                ? objDeparture?.[1]
                                                : objReturn?.[1],
                                              i === 0 ? "departure" : "return"
                                            );
                                            i === 0
                                              ? setClickedSeat(null)
                                              : setClickedSeatReturn(null);
                                          }}
                                          className={`w-1/2 h-8 transition-colors flex items-center justify-center ${
                                            seat.passengerType === "child"
                                              ? "bg-blue-100"
                                              : "hover:bg-gray-100"
                                          }`}>
                                          <Baby size={18} />
                                        </motion.button>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                            </AnimatePresence>
                            <motion.div
                              whileHover={{
                                scale:
                                  (i === 0
                                    ? objDeparture
                                    : objReturn)?.[2]?.soGhePhoThong_Booked?.includes(
                                    seat.id
                                  ) ||
                                  (i === 0
                                    ? objDeparture
                                    : objReturn)?.[2]?.soGheThuongGia_Booked?.includes(
                                    seat.id
                                  )
                                    ? 1
                                    : 1.05,
                              }}
                              className={`w-10 h-10 flex items-center justify-center border rounded text-sm transition-all duration-200 select-none
                            ${
                              (i === 0
                                ? objDeparture
                                : objReturn)?.[2]?.soGhePhoThong_Booked?.includes(
                                seat.id
                              ) ||
                              (i === 0
                                ? objDeparture
                                : objReturn)?.[2]?.soGheThuongGia_Booked?.includes(
                                seat.id
                              )
                                ? "bg-red-500 text-white cursor-not-allowed opacity-80"
                                : seat.booked
                                  ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                  : seat.type === "business"
                                    ? "bg-yellow-300 hover:bg-yellow-400 cursor-pointer"
                                    : "bg-green-300 hover:bg-green-400 cursor-pointer"
                            }`}>
                              {(i === 0
                                ? objDeparture
                                : objReturn)?.[2]?.soGhePhoThong_Booked?.includes(
                                seat.id
                              ) ||
                              (i === 0
                                ? objDeparture
                                : objReturn)?.[2]?.soGheThuongGia_Booked?.includes(
                                seat.id
                              ) ? (
                                seat.id
                              ) : seat.booked ? (
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
            </>
          ))}
        </div>
      </div>

      <div className="col-start-5 col-span-2 overflow-y-auto h-full rounded-lg bg-white">
        {Array.from({ length: objReturn ? 2 : 1 }, (_, i) => (
          <>
            <div className="p-5 uppercase">
              <h2 className="text-xl text-center font-bold mb-1">
                Thông tin đặt chỗ
              </h2>
              <p
                className={`text-center text-sm ${i === 0 ? "departure-flight" : "return-flight"}`}>
                (Chuyến bay {i === 0 ? "đi" : "khứ hồi"})
              </p>

              <div className="h-fit bg-transparent rounded-2xl shadow-md w-full overflow-hidden">
                <ItemFlight
                  hangBay={`${(i === 0 ? objDeparture : objReturn)[0].hangBay}`}
                  soHieu={`${(i === 0 ? objDeparture : objReturn)[0].soHieu}`}
                  loaiMayBay={`${(i === 0 ? objDeparture : objReturn)[0].loaiMayBay}`}
                  gioBay={`${(i === 0 ? objDeparture : objReturn)[0].gioBay}`}
                  diemBay={`${(i === 0 ? objDeparture : objReturn)[0].diemBay}`}
                  gioDen={`${(i === 0 ? objDeparture : objReturn)[0].gioDen}`}
                  diemDen={`${(i === 0 ? objDeparture : objReturn)[0].diemDen}`}
                  gia={`${(i === 0 ? objDeparture : objReturn)[0].gia}`}
                  ThuongGia={`${(i === 0 ? objDeparture : objReturn)[0].ThuongGia}`}
                  PhoThong={`${(i === 0 ? objDeparture : objReturn)[0].PhoThong}`}
                />
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Hành khách</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={20} className="text-blue-500" />
                    <span>
                      Người lớn:{" "}
                      {i === 0 ? objDeparture?.[1]?.[0] : objReturn?.[1]?.[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Baby size={20} className="text-blue-500" />
                    <span>
                      Trẻ em:{" "}
                      {i === 0 ? objDeparture?.[1]?.[1] : objReturn?.[1]?.[1]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Ghế đã chọn</h3>
                <div className="space-y-2">
                  {(i === 0 ? selectedSeats : selectedSeatsReturn).size ===
                  0 ? (
                    <div className="flex items-center justify-center bg-gray-50 p-2 rounded">
                      <span className="text-gray-500">Trống</span>
                    </div>
                  ) : (
                    Array.from(
                      i === 0 ? selectedSeats : selectedSeatsReturn
                    ).map((seatId) => {
                      const [row, col] = findSeatPosition(seatId);
                      const seat = (i === 0 ? seats : seatsReturn)[row]?.[col];
                      return (
                        <div
                          key={seatId}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="font-medium">{seatId}</span>
                          <span className="font-medium">
                            {handleCalculatePrice({
                              passengerType: seat?.passengerType,
                              seatType: seat?.type,
                              price: (i === 0 ? objDeparture : objReturn)[0]
                                .gia,
                            })}

                            <span className="text-xs text-gray-600">
                              {seat?.type === "business"
                                ? "(Thương gia)"
                                : "(Phổ thông)"}
                            </span>
                          </span>
                          <span className="text-sm text-gray-600">
                            {seat?.passengerType === "adult"
                              ? "Người lớn"
                              : "Trẻ em"}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Tổng số tiền cần thanh toán
                </h3>
                <p className="text-xl font-bold text-[#FF5E1F]">
                  {(i === 0 ? selectedSeats : selectedSeatsReturn).size > 0
                    ? calculateTotalPrice(i === 0 ? "departure" : "return")
                    : "0 VND"}
                </p>
              </div>
            </div>
          </>
        ))}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShowPassengerInfo}
          className="flex p-3 bg-[#0194F3] mb-5 text-white mt-3 mx-auto font-semibold rounded-lg gap-x-3 items-center justify-center transition-all duration-200 hover:bg-[#0184d9] hover:shadow-lg active:shadow-md">
          Nhập thông tin hành khách
        </motion.button>
      </div>
    </div>
  );
}

const ComponentInputInformationPassenger = ({
  airportDeparture,
  airportReturn,
  oneWayFlight,
  selectedSeats,
}) => {
  console.log(selectedSeats);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: Array(3).fill({
        loaiTuoi: "",
        Ten: "",
        ngaySinh: "",
        hangVe: "",
        giaVe: 0,
        maChuyenBay: airportDeparture._id,
      }),
      ...(oneWayFlight
        ? {}
        : {
            itemsB: Array().fill({
              loaiTuoi: "",
              Ten: "",
              ngaySinh: "",
              hangVe: "",
              giaVe: 0,
              maChuyenBay: airportReturn?._id,
            }),
          }),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const { fields: fieldsB } = useFieldArray({
    control,
    name: "itemsB",
  });

  const [hideAirportsDeparture, setHideAirportsDeparture] = useState(false);
  const [hideAirportsReturn, setHideAirportsReturn] = useState(false);

  const handleCopyPassengerAirportDepartureToReturn = () => {
    fieldsB.forEach((item, index) => {
      setValue(`itemsB.${index}.Ten`, watch(`items.${index}.Ten`));
      setValue(`itemsB.${index}.ngaySinh`, watch(`items.${index}.ngaySinh`));
    });
  };

  const submitFormInfo = (data) => {
    console.log(data);
  };
  // onClick={() => setHideAirportsDeparture(!hideAirportsDeparture)}
  return (
    <div>
      <form onSubmit={handleSubmit(submitFormInfo)} className="">
        {!oneWayFlight && (
          <button>
            type="button" className="flex w-full border-b"
            <h1 className="text-center w-full text-xl uppercase font-bold mb-3">
              -------Chuyến bay đi-------
            </h1>
            {/* {!hideAirportsDeparture ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
                />
              </svg>
            )} */}
          </button>
        )}

        {fields.map((item, index) => (
          <div
            key={airportDeparture._id + index}
            className={`w-full flex justify-between mb-6 transition-all duration-0 ${hideAirportsDeparture ? "h-0 overflow-hidden duration-500" : ""}`}>
            <ThongTinHanhKhach
              register={register}
              index={index}
              item="items"
              // passenger={quantityTicketsDeparture}
              passenger={{
                quantityTicketsOfAdult: [1, 0],
                quantityTicketsOfChild: [1, 0],
                quantityTicketsOfBaby: 0,
              }}
              errors={errors}
              setValue={setValue}
              watch={watch}
              airport={airportDeparture}
            />
          </div>
        ))}

        {!oneWayFlight && (
          <>
            <div className="flex w-full border-b">
              <h1 className="text-center w-full text-xl uppercase font-bold mb-3">
                -------Chuyến bay khứ hồi-------
              </h1>
              {/* <div className="flex gap-x-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 cursor-pointer"
                  onClick={handleCopyPassengerAirportDepartureToReturn}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 cursor-pointer"
                  onClick={() => setHideAirportsReturn(!hideAirportsReturn)}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={`${!hideAirportsReturn ? "M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" : "M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"}`}
                  />
                </svg>
              </div> */}
            </div>
          </>
        )}

        <button
          // type={mutationCreateOrder.isPending ? "button" : "submit"}
          className="flex p-3 bg-[#0194F3] text-white mt-3 float-right font-semibold rounded-lg gap-x-3 items-center justify-center">
          {/* {mutationCreateOrder.isPending ? (
            <l-bouncy size="30" speed="1.75" color="white" />
          ) : (
            <>
              Thanh toán
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                />
              </svg>
            </>
          )} */}
          Thanh toán
        </button>
      </form>
    </div>
  );
};

function ThongTinHanhKhach({
  register,
  index,
  item,
  errors,
  setValue,
  watch,
  airport,
  passenger,
}) {
  const { handleReplacePriceAirport } = useContext(CONTEXT);

  // useEffect(() => {
  //   setValue(
  //     `${item}.${index}.hangVe`,
  //     passenger.quantityTicketsOfAdult[0] > 0 &&
  //       index + 1 <= passenger.quantityTicketsOfAdult[0]
  //       ? "Vé phổ thông"
  //       : passenger.quantityTicketsOfAdult[1] > 0 &&
  //           index <
  //             passenger.quantityTicketsOfAdult[0] +
  //               passenger.quantityTicketsOfAdult[1]
  //         ? "Vé thương gia"
  //         : passenger.quantityTicketsOfChild[0] > 0 &&
  //             index <
  //               passenger.quantityTicketsOfChild[0] +
  //                 passenger.quantityTicketsOfAdult[0] +
  //                 passenger.quantityTicketsOfAdult[1]
  //           ? "Vé phổ thông"
  //           : passenger.quantityTicketsOfChild[1] > 0
  //             ? "Vé thương gia"
  //             : "Ngồi chung với người lớn",
  //     { shouldValidate: true }
  //   );

  //   // setValue(
  //   //   `${item}.${index}.loaiTuoi`,
  //   //   passenger.quantityTicketsOfAdult[0] +
  //   //     passenger.quantityTicketsOfAdult[1] >
  //   //     0 &&
  //   //     index + 1 <=
  //   //       passenger.quantityTicketsOfAdult[0] +
  //   //         passenger.quantityTicketsOfAdult[1]
  //   //     ? `người lớn thứ ${index + 1}`
  //   //     : passenger.quantityTicketsOfChild[0] +
  //   //           passenger.quantityTicketsOfChild[1] >
  //   //           0 &&
  //   //         index <
  //   //           passenger.quantityTicketsOfChild[0] +
  //   //             passenger.quantityTicketsOfChild[1] +
  //   //             passenger.quantityTicketsOfAdult[0] +
  //   //             passenger.quantityTicketsOfAdult[1]
  //   //       ? `trẻ em thứ ${
  //   //           index -
  //   //           (passenger.quantityTicketsOfAdult[0] +
  //   //             passenger.quantityTicketsOfAdult[1]) +
  //   //           1
  //   //         }`
  //   //       : passenger.quantityTicketsOfBaby > 0 &&
  //   //           index <
  //   //             passenger.quantityTicketsOfBaby +
  //   //               passenger.quantityTicketsOfChild[0] +
  //   //               passenger.quantityTicketsOfChild[1] +
  //   //               passenger.quantityTicketsOfAdult[0] +
  //   //               passenger.quantityTicketsOfAdult[1]
  //   //         ? `em bé thứ ${
  //   //             index -
  //   //             (passenger.quantityTicketsOfChild[0] +
  //   //               passenger.quantityTicketsOfChild[1] +
  //   //               passenger.quantityTicketsOfAdult[0] +
  //   //               passenger.quantityTicketsOfAdult[1]) +
  //   //             1
  //   //           }`
  //   //         : "aaa"
  //   // );

  //   // setValue(
  //   //   `${item}.${index}.giaVe`,
  //   //   watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] === "người lớn" &&
  //   //     watch(`${item}.${index}.hangVe`) === "Vé phổ thông"
  //   //     ? new Intl.NumberFormat("vi-VN").format(
  //   //         handleReplacePriceAirport(airport.gia)
  //   //       ) + " VND"
  //   //     : watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] === "người lớn" &&
  //   //         watch(`${item}.${index}.hangVe`) === "Vé thương gia"
  //   //       ? new Intl.NumberFormat("vi-VN").format(
  //   //           Math.floor(handleReplacePriceAirport(airport.gia) * 1.5)
  //   //         ) + " VND"
  //   //       : watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] === "trẻ em" &&
  //   //           watch(`${item}.${index}.hangVe`) === "Vé phổ thông"
  //   //         ? new Intl.NumberFormat("vi-VN").format(
  //   //             Math.floor(handleReplacePriceAirport(airport.gia) * 0.75)
  //   //           ) + " VND"
  //   //         : watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] ===
  //   //               "trẻ em" &&
  //   //             watch(`${item}.${index}.hangVe`) === "Vé thương gia"
  //   //           ? new Intl.NumberFormat("vi-VN").format(
  //   //               Math.floor(
  //   //                 handleReplacePriceAirport(airport.gia) * 0.75 * 1.5
  //   //               )
  //   //             ) + " VND"
  //   //           : watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] === "em bé"
  //   //             ? "0 VND"
  //   //             : ""
  //   // );
  // }, [
  //   index,
  //   setValue,
  //   passenger,
  //   airport,
  //   watch,
  //   handleReplacePriceAirport,
  //   item,
  // ]);
  return (
    <div className="bg-white shadow-lg rounded-md p-5 w-full">
      <h3 className="text-sm font-bold mb-6 text-left">
        Thông tin vé ghế {watch(`${item}.${index}.loaiTuoi`)}{" "}
      </h3>

      <div className="flex flex-col gap-x-5 mb-6 text-base font-semibold">
        <div className="inputBox w-full mb-6">
          <input
            className={`${errors?.[item]?.[index]?.Ten ? "inputTagBug" : "inputTag"}`}
            type="text"
            required
            {...register(`${item}.${index}.Ten`, {
              required: "full name",
              minLength: {
                value: 2,
                message: "Ít nhất 2 kí tự",
              },
              maxLength: {
                value: 50,
                message: "Nhiều nhất 50 kí tự",
              },
              pattern: {
                value: /^[a-zA-ZÀ-ỹà-ỹ\s]+$/,
                message: "Nhập chữ",
              },
            })}
          />
          <span className={`spanTag`}>
            {errors?.[item]?.[index]?.Ten
              ? errors?.[item]?.[index].Ten.message
              : `FULL NAME [${watch(`${item}.${index}.Ten`).length}/70]`}
          </span>
        </div>
        <div className="mb-6 inputBox w-full">
          <input
            className={`${errors[item]?.[index]?.ngaySinh ? "inputTagBug" : "inputExist"}`}
            type="date"
            // defaultValue={airport.da?.birthday}
            required
            {...register(`${item}.${index}.ngaySinh`, {
              required: "birthday",
              validate: {
                validAge: (value) => {
                  const today = new Date();
                  const birthDate = new Date(value);
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const monthDiff = today.getMonth() - birthDate.getMonth();
                  const dayDiff = today.getDate() - birthDate.getDate();

                  const adjustedAge =
                    monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
                      ? age - 1
                      : age;

                  if (
                    watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] ===
                    "người lớn"
                  ) {
                    return (
                      (adjustedAge >= 12 && adjustedAge <= 80) ||
                      "Người lớn từ 12 đến 80 tuổi"
                    );
                  }
                  if (
                    watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] ===
                    "trẻ em"
                  ) {
                    return (
                      (adjustedAge <= 12 && adjustedAge >= 2) ||
                      "Trẻ em dưới 12 và trên 2 tuổi"
                    );
                  }
                  if (
                    watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] ===
                    "em bé"
                  ) {
                    return (
                      adjustedAge < 2 ||
                      "Em bé dưới 2 tuổi và không quá hiện tại"
                    );
                  }

                  return true;
                },
              },
            })}
          />
          <span className={`spanTag whitespace-nowrap`}>
            {errors[item]?.[index]?.ngaySinh
              ? errors[item]?.[index]?.ngaySinh.message
              : "Ngày sinh"}
          </span>
        </div>
      </div>

      {/* <div className="flex justify-between w-full">
        <button
          className={`border-2 rounded-lg h-fit flex justify-center gap-x-4 w-[47%] p-2  mb-6 ${watch(`${item}.${index}.hangVe`) === "Vé phổ thông" ? "border-[#0194F3] " : "border-gray-300 opacity-50 cursor-not-allowed"} `}
          type="button">
          <img
            alt=""
            className="w-16 bg-cover h-14"
            src="https://ik.imagekit.io/tvlk/image/imageResource/2022/12/20/1671519148670-d3ca3132946e435bd467ccc096730670.png"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold">Vé phổ thông</span>
            <span className="text-lg font-semibold text-[#FF5E1F]">
              {watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] ===
              "người lớn"
                ? new Intl.NumberFormat("vi-VN").format(
                    handleReplacePriceAirport(airport.gia)
                  )
                : watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] ===
                    "trẻ em"
                  ? new Intl.NumberFormat("vi-VN").format(
                      handleReplacePriceAirport(airport.gia) * 0.75
                    )
                  : "0"}{" "}
              {" VND"}
              <span className="text-sm font-semibold text-[#a0a0a0]">
                / khách
              </span>
            </span>
          </div>
        </button>
        <button
          type="button"
          className={`border-2 rounded-lg h-fit flex gap-x-4 w-[47%] justify-center p-2 ${watch(`${item}.${index}.hangVe`) === "Vé thương gia" ? "border-[#0194F3]" : "border-gray-300 opacity-50 cursor-not-allowed"}`}>
          <img
            alt=""
            className="w-16 bg-cover h-14"
            src="https://ik.imagekit.io/tvlk/image/imageResource/2022/12/23/1671789427394-4441a4e3f0b96ea01dccf4a620bad996.png"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold whitespace-nowrap">
              Vé thương gia
            </span>
            <span className="text-lg font-semibold text-[#FF5E1F]">
              {watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] ===
              "người lớn"
                ? new Intl.NumberFormat("vi-VN").format(
                    Math.floor(handleReplacePriceAirport(airport.gia) * 1.5)
                  )
                : watch(`${item}.${index}.loaiTuoi`).split(" thứ")[0] ===
                    "trẻ em"
                  ? new Intl.NumberFormat("vi-VN").format(
                      Math.floor(
                        handleReplacePriceAirport(airport.gia) * 0.75 * 1.5
                      )
                    )
                  : "0"}{" "}
              {" VND"}
              <span className="text-sm font-semibold text-[#a0a0a0]">
                /khách
              </span>
            </span>
          </div>
        </button>
      </div> */}
    </div>
  );
}

export default AdjustQuantityv2;
