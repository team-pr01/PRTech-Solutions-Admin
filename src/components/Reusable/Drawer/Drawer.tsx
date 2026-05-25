import { RxCross1 } from "react-icons/rx";

type TDrawerProps = {
  heading?: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  position?: "left" | "right";
  width?: string;
};

const Drawer: React.FC<TDrawerProps> = ({
  heading,
  isDrawerOpen,
  setIsDrawerOpen,
  children,
  position = "right",
  width = "w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[30%]",
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`${
          isDrawerOpen ? "visible" : "invisible"
        } w-full h-screen fixed top-0 left-0 z-[200000000] bg-neutral-5/60 backdrop-blur-xs transition-all duration-500`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`${
          isDrawerOpen ? "translate-x-0" : position === "right" ? "translate-x-full" : "-translate-x-full"
        } fixed top-0 ${position === "right" ? "right-0" : "left-0"} ${width} h-full bg-white shadow-2xl z-[200000001] transition-transform duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full p-4 md:p-6 border-b border-gray-200">
          <h1 className="text-base md:text-xl font-semibold text-gray-800">
            {heading}
          </h1>
          <RxCross1
            className="text-lg cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </div>
    </>
  );
};

export default Drawer;