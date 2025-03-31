import { useEffect } from "react";
import { useState } from "react";

function AdjustQuantityv2({
  totalEconomySeats = 100,
  totalBusinessSeats = 70,
  objDeparture,
  setSelectedDepartureAirport,
  setPassengerChooseDeparture,
  objReturn,
  countDepartureFlights,
  countReturnFlights,
}) {
  const seatsPerRow = 6; // 6 cột cố định
  const businessRows = Math.ceil(totalBusinessSeats / seatsPerRow); // Số hàng thương gia
  const economyRows = Math.ceil(totalEconomySeats / seatsPerRow); // Số hàng phổ thông
  const totalRows = businessRows + economyRows;

  const generateSeats = () => {
    return Array.from({ length: totalRows }, (_, row) => {
      const seatType = row < businessRows ? "business" : "economy";
      return [
        { id: `${row + 1}D`, booked: false, type: seatType },
        { id: `${row + 1}F`, booked: false, type: seatType },
        { id: `${row + 1}R`, booked: false, type: seatType },
        null, // Lối đi
        { id: `${row + 1}U`, booked: false, type: seatType },
        { id: `${row + 1}I`, booked: false, type: seatType },
        { id: `${row + 1}T`, booked: false, type: seatType },
      ];
    });
  };
  const [seats, setSeats] = useState([]);
  useEffect(() => {
    setSeats(generateSeats());
  }, [totalEconomySeats, totalBusinessSeats]);

  const handleSeatClick = (rowIdx, colIdx) => {
    const newSeats = [...seats];
    const seat = newSeats[rowIdx][colIdx];
    if (seat && !seat.booked) {
      newSeats[rowIdx][colIdx] = { ...seat, booked: true };
      setSeats(newSeats);
    }
  };
  return (
    <div className="fixed z-20 flex items-center justify-center w-full h-screen bg-white/10 backdrop-brightness-75 ">
      <div className="absolute z-20 w-full h-full"></div>
      <div
        className={`absolute z-20 m-auto max-h-[80%] h-fit md:w-[45%] w-11/12 rounded-lg  p-4 top-24 overflow-y-auto bg-white`}
      >
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
                        className={`w-10 h-10 flex items-center justify-center border rounded cursor-pointer text-sm
                      ${
                        seat.booked
                          ? "bg-red-500 text-white cursor-not-allowed"
                          : seat.type === "business"
                            ? "bg-yellow-300 hover:bg-yellow-400"
                            : "bg-green-300 hover:bg-green-400"
                      }`}
                        onClick={() => handleSeatClick(rowIdx, colIdx)}
                      >
                        {seat.id}
                      </div>
                    ) : (
                      <div
                        key={`aisle-${rowIdx}`}
                        className="w-10 h-10 bg-gray-100"
                      ></div>
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
