/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";

type TDashboardOverviewCardProps = {
  title: string;
  additionalTitle?: string;
  value: string;
  icon?: any;
  textColor: string;
  iconColor?: string;
  path: string;
  onClick?: () => void;
};
const DashboardOverviewCard: React.FC<TDashboardOverviewCardProps> = ({
  title,
  additionalTitle,
  value,
  icon,
  textColor,
  iconColor,
  path,
  onClick
}) => {
  return (
    <Link
      to={path}
      onClick={onClick && onClick}
      className={`w-full min-w-fit md:min-w-[248px] xl:min-w-fit bg-transparent md:bg-white rounded-2xl border-none md:border border-primary-40/10 py-0 md:py-[22px] px-0 md:px-5 font-Nunito flex flex-col-reverse md:flex-row items-center justify-between gap-3 md:gap-0 ${textColor}`}
    >
      <div className="text-center md:text-left">
        <h2 className="text-xs md:text-lg xl:text-base 2xl:text-lg font-semibold flex flex-row gap-2">
          {title} <span className="hidden 2xl:block">{additionalTitle}</span>
        </h2>
        <h1 className="text-xs md:text-3xl 2xl:4xl font-bold mt-0 md:mt-2">{value}</h1>
        
      </div>
      <div className={`size-10 md:size-16 xl:size-12 2xl:size-16 text-lg md:text-2xl rounded-full bg-primary-10 md:bg-neutral-20/10 flex items-center justify-center ${iconColor} `}>
        {icon}
      </div>
    </Link>
  );
};

export default DashboardOverviewCard;
