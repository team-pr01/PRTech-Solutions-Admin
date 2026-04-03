import { useState } from "react";
import AdminTestimonialCard from "../../../../components/Admin/TestimonialManagementPage/AdminTestimonialCard/AdminTestimonialCard";
import { FiStar } from "react-icons/fi";
import AddTestimonialModal from "../../../../components/Admin/TestimonialManagementPage/AddTestimonialModal/AddTestimonialModal";
import {
  useGetAllTestimonialsQuery,
  useGetSingleTestimonialByIdQuery,
} from "../../../../redux/Features/Testimonial/testimonialApi";
import type { TTestimonial } from "../../../../types/testimonial.types";
import Loader from "../../../../components/Reusable/Loader/Loader";
import NoData from "../../../../components/Reusable/NoData/NoData";
import LogoLoader from "../../../../components/Reusable/LogoLoader/LogoLoader";
import ErrorComponent from "../../../../components/Reusable/ErrorComponent/ErrorComponent";
import { skipToken } from "@reduxjs/toolkit/query";
const TestimonialManagement = () => {
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  // const [role, setRole] = useState<"tutor" | "guardian" | "">("");
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<
    string | null
  >(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] =
    useState<boolean>(false);

  const {
    data: allTestimonials,
    isLoading,
    isError,
  } = useGetAllTestimonialsQuery({});
  const {
  data: singleTestimonial,
  isLoading: isSingleTestimonialLoading,
  isFetching: isSingleTestimonialFetching,
} = useGetSingleTestimonialByIdQuery(
  selectedTestimonialId ?? skipToken
);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-Nunito">
        <LogoLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-Nunito">
        <ErrorComponent />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-neutral-30/20 pb-3">
        <h3 className="text-xl font-semibold">Total Testimonials ({allTestimonials?.data?.length || 0})</h3>
        <button
          onClick={() => {
            setModalType("add");
            setIsTestimonialModalOpen(true);
            setSelectedTestimonialId(null);
          }}
          className={`bg-primary-10 hover:bg-primary-20 hover:text-primary-10 transition duration-300 font-semibold text-white rounded-lg flex items-center gap-2 px-3 py-2 pointer cursor-pointer`}
        >
          Add Testimonial <FiStar className="text-lg" />
        </button>
      </div>
      {isLoading ? (
        <div className="py-10">
          <Loader size="lg" text="Please wait..." />
        </div>
      ) : allTestimonials?.data && allTestimonials.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTestimonials.data.map((testimonial: TTestimonial) => (
            <AdminTestimonialCard
              key={testimonial?._id}
              _id={testimonial._id}
              userName={testimonial.name}
              userImage={testimonial.imageUrl}
              location={testimonial.designation}
              role={testimonial.role}
              rating={testimonial.rating}
              review={testimonial.review}
              onEdit={() => {
                setModalType("edit");
                setIsTestimonialModalOpen(true);
                setSelectedTestimonialId(testimonial?._id);
              }}
            />
          ))}
        </div>
      ) : (
        <NoData />
      )}

      <AddTestimonialModal
        isTestimonialModalOpen={isTestimonialModalOpen}
        setIsTestimonialModalOpen={setIsTestimonialModalOpen}
        modalType={modalType}
        setModalType={setModalType}
        defaultValues={singleTestimonial?.data}
        isLoading={isSingleTestimonialLoading || isSingleTestimonialFetching}
      />
    </div>
  );
};

export default TestimonialManagement;
