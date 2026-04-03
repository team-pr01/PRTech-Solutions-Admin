import { useNavigate, useParams } from "react-router-dom";
import { ICONS, IMAGES } from "../../../../assets";
import Button from "../../../../components/Reusable/Button/Button";
import { useGetSingleGuardianByCustomGuardianIdQuery } from "../../../../redux/Features/Guardian/guardianApi";
import { formatDate } from "../../../../utils/formatDate";
import LogoLoader from "../../../../components/Reusable/LogoLoader/LogoLoader";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../../../redux/Features/Auth/authSlice";
import type { TLoggedInUser } from "../../../../types/loggedinUser.types";

const GuardianProfile = () => {
  const { id } = useParams();
  const user = useSelector(useCurrentUser) as TLoggedInUser;
  const navigate = useNavigate();
  const { data, isLoading: isProfileDataLoading } =
    useGetSingleGuardianByCustomGuardianIdQuery(id);
  const guardianInfo = data?.data || {};

  const personalInfo = {
    email: guardianInfo?.userId?.email || "",
    phoneNumber: guardianInfo?.userId?.phoneNumber || "",
    additionalNumber:
      guardianInfo?.personalInformation?.additionalPhoneNumber || "",
    city: guardianInfo?.userId?.city || "",
    area: guardianInfo?.userId?.area || "",
    address: guardianInfo?.personalInformation?.address || "",
    gender: guardianInfo?.userId?.gender || "",
    dateOfBirth: guardianInfo?.personalInformation?.dateOfBirth || "",
    religion: guardianInfo?.personalInformation?.religion || "",
    nationality: guardianInfo?.personalInformation?.nationality || "",
  };

  const details = [
    { label: "Email", value: personalInfo?.email },
    { label: "Gender", value: personalInfo?.gender },
    { label: "Phone Number", value: personalInfo?.phoneNumber },
    { label: "Additional Number", value: personalInfo?.additionalNumber },
    { label: "City", value: personalInfo?.city },
    { label: "Address", value: personalInfo?.address },
    { label: "Date of Birth", value: formatDate(personalInfo?.dateOfBirth) },
    { label: "Religion", value: personalInfo?.religion },
    { label: "Nationality", value: personalInfo?.nationality },
  ];

  const emergencyInformation = {
    emergencyContactPersonName:
      guardianInfo?.emergencyInformation?.emergencyContactPersonName || "",
    relation: guardianInfo?.emergencyInformation?.relation || "",
    phoneNumber: guardianInfo?.personalInformation?.phoneNumber || "",
    address: guardianInfo?.emergencyInformation?.address || "",
  };

  const emergencyDetails = [
    {
      label: "Emergency Contact Person Name",
      value: emergencyInformation?.emergencyContactPersonName,
    },
    { label: "Relation", value: emergencyInformation?.relation },
    { label: "Phone Number", value: emergencyInformation?.phoneNumber },
    { label: "Address", value: emergencyInformation?.address },
  ];

  const isProvided = (val: unknown): boolean => {
    if (Array.isArray(val))
      return val.length > 0 && val.some((v) => String(v).trim() !== "");
    if (typeof val === "string") return val.trim() !== "";
    return val !== null && val !== undefined;
  };

  if (isProfileDataLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-Nunito">
        <LogoLoader />
      </div>
    );
  }

  return (
    <div className="font-Nunito">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 items-start lg:items-center justify-between pb-5">
        <div className="flex items-center gap-3">
          <div className="size-24 lg:size-32 rounded-full relative">
            <div className="bg-white/40 rounded-full p-[2px] size-full">
              <img
                src={guardianInfo?.imageUrl || IMAGES.dummyAvatar}
                alt=""
                className="size-full rounded-full"
              />
            </div>
            <div className="bg-primary-10 shadow-2xl size-5 rounded-full flex items-center justify-center absolute right-4 bottom-1">
              <img src={ICONS.blueVerifiedBlue} alt="" className="" />
            </div>
          </div>
          <div>
            <h1 className="text-neutral-5 font-semibold text-2xl mt-2">
              {guardianInfo?.userId?.name}
            </h1>
            <h2 className="text-neutral-5e text-sm mt-2">
              <strong>Guardian Id:</strong> {id} | <strong>Rating:</strong>{" "}
              {guardianInfo?.rating}/5
            </h2>
            <h2 className="text-neutral-5e text-sm mt-2 flex">
              <strong>Phone Number</strong>:{" "}
              <a
                href={`tel:${guardianInfo?.userId?.phoneNumber}`}
                className="text-neutral-20 hidden lg:block underline ml-2"
              >
                {guardianInfo?.userId?.phoneNumber}
              </a>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            label="Go Back"
            variant="tertiary"
            className="py-2 lg:py-2 px-3 lg:px-3 w-fit flex-row-reverse items-center justify-center hover:bg-primary-10/90 hover:text-white"
            onClick={() => navigate(-1)}
          />
          <Button
            type="button"
            label="See Guardian Posted Jobs"
            variant="primary"
            className="py-2 lg:py-2 px-3 lg:px-3 w-fit flex-row-reverse items-center justify-center hover:bg-primary-10/90 hover:text-white"
            onClick={() =>
              navigate(
                `/dashboard/${
                  user?.role === "admin" ? "admin" : "staff"
                }/guardian/jobs/${guardianInfo?.userId?._id}`
              )
            }
          />
        </div>
      </div>

      <p className="text-neutral-10 text-lg font-medium border-b pb-2 border-primary-10 mt-2">
        Personal and Emergency Information
      </p>

      <div className="flex flex-col gap-3 bg-white p-5 rounded-2xl shadow-sm w-full h-fit mt-6">
        {details.map((item, index) => {
          const provided = isProvided(item.value);

          return (
            <div
              key={index}
              className="flex text-[13px] md:text-sm lg:text-base"
            >
              <span className="text-neutral-5 font-medium min-w-[140px] lg:min-w-[200px] xl:min-w-fit">
                {item.label}
              </span>
              <span className="text-neutral-5 font-medium">:</span>
              <span
                className={`ml-2 ${
                  provided ? "text-neutral-45" : "text-red-500"
                }`}
              >
                {provided
                  ? Array.isArray(item.value)
                    ? (item.value as string[]).join(", ")
                    : item.value
                  : "Not Provided"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 bg-white p-5 rounded-2xl shadow-sm w-full h-fit mt-6">
        {emergencyDetails?.map((item, index) => {
          const provided = isProvided(item.value);

          return (
            <div
              key={index}
              className="flex text-[13px] md:text-sm lg:text-base"
            >
              <span className="text-neutral-5 font-medium min-w-[140px] lg:min-w-[200px] xl:min-w-fit">
                {item.label}
              </span>
              <span className="text-neutral-5 font-medium">:</span>
              <span
                className={`ml-2 ${
                  provided ? "text-neutral-45" : "text-red-500"
                }`}
              >
                {provided
                  ? Array.isArray(item.value)
                    ? (item.value as string[]).join(", ")
                    : item.value
                  : "Not Provided"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuardianProfile;
