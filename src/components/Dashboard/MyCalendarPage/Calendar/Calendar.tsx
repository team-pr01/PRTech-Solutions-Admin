import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type TCalendarProps = {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  getHasMeetings: (date: Date) => boolean;
};

const Calendar: React.FC<TCalendarProps> = ({
  selectedDate,
  onDateSelect,
  getHasMeetings,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
  });

  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const daysInMonth = getDaysInMonth(currentDate);

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  const goToToday = () => {
    const today = new Date();

    setCurrentDate(today);

    onDateSelect(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
    );
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={goToPreviousMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
        >
          <FiChevronLeft size={18} />
        </button>

        <div className="text-center">
          <h3 className="font-semibold text-gray-800">
            {currentMonth} {currentYear}
          </h3>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
        >
          <FiChevronRight size={18} />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
          <div
            key={idx}
            className="text-center text-xs font-medium text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date, idx) => {
          const isSelected = date
            ? isSameDay(date, selectedDate)
            : false;

          const isToday = date
            ? isSameDay(date, new Date())
            : false;

          const hasMeeting = date
            ? getHasMeetings(date)
            : false;

          return (
            <button
              key={idx}
              disabled={!date}
              onClick={() => date && handleDateClick(date)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all
                ${!date ? "bg-gray-50 cursor-default" : "hover:bg-gray-100"}
                ${
                  isSelected
                    ? "bg-primary-10 text-white"
                    : "text-gray-700"
                }
                ${
                  isToday && !isSelected
                    ? "border border-primary-10"
                    : ""
                }
              `}
            >
              {date && (
                <>
                  <span className={isSelected ? "font-semibold" : ""}>
                    {date.getDate()}
                  </span>

                  {hasMeeting && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isSelected
                          ? "bg-white"
                          : "bg-primary-10"
                      }`}
                    />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Today Button */}
      <button
        onClick={goToToday}
        className="w-full mt-4 text-center text-sm text-primary-10 hover:underline py-2"
      >
        Today
      </button>
    </div>
  );
};

export default Calendar;