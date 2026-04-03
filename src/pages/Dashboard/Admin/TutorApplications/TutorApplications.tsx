/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAllApplicationOfATutorQuery } from "../../../../redux/Features/Application/applicationApi";
import {
  FiUserCheck,
  FiSend,
  FiStar,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import JobCard from "../../../../components/JobBoardPage/Jobs/JobCard/JobCard";
import JobCardSkeleton from "../../../../components/JobBoardPage/Jobs/JobCard/JobCardSkeleton";

const TutorApplications = () => {
  const { userId } = useParams();
  const [skip, setSkip] = useState<number>(0);
  const limit = 20;
  const [activeTab, setActiveTab] = useState<string>("applied");

  const {
    data: applications,
    isLoading,
    isFetching,
  } = useGetAllApplicationOfATutorQuery({
    userId: userId as string,
    skip,
    limit,
    status: activeTab === "applied" ? "" : activeTab,
  });

  const [jobs, setJobs] = useState<any[]>([]);

  // reset pagination & data when tab changes
  useEffect(() => {
    setSkip(0);
    setJobs([]);
  }, [activeTab]);

  // Update jobs when new data arrives
  useEffect(() => {
    if (applications?.data?.applications) {
      if (skip === 0) {
        setJobs(applications.data.applications);
      } else {
        setJobs((prev) => {
          const newJobs = applications.data.applications.filter(
            (job: any) => !prev.some((p) => p._id === job._id),
          );
          return [...prev, ...newJobs];
        });
      }
    }
  }, [applications?.data?.applications, skip]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetching &&
          applications?.data?.meta?.hasMore
        ) {
          setSkip((prev) => prev + limit);
        }
      },
      { threshold: 1 },
    );

    const node = loaderRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [applications, isFetching, applications?.data?.meta?.hasMore, activeTab]);

  // Infinite Scroll Observer
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const counts = applications?.data?.meta || {};

  const jobTabs = [
    {
      id: 1,
      key: "applied",
      path: "/dashboard/tutor/my-applications/applied",
      title: "Applied Jobs",
      count: counts?.totalApplied || 0,
      icon: <FiSend />,
    },
    // {
    //   id: 2,
    //   key: "withdrawn",
    //   path: "/dashboard/tutor/my-applications/withdrawn",
    //   title: "Withdrawn Jobs",
    //   count: counts?.totalWithdrawn || 0,
    //   icon: <FiCornerUpLeft />,
    // },
    {
      id: 3,
      key: "shortlisted",
      path: "/dashboard/tutor/my-applications/shortlisted",
      title: "Shortlisted Jobs",
      count: counts?.totalShortlisted || 0,
      icon: <FiStar />,
    },
    {
      id: 4,
      key: "appointed",
      path: "/dashboard/tutor/my-applications/appointed",
      title: "Appointed Jobs",
      count: counts?.totalAppointed || 0,
      icon: <FiUserCheck />,
    },
    {
      id: 5,
      key: "confirmed",
      path: "/dashboard/tutor/my-applications/confirmed",
      title: "Confirmed Jobs",
      count: counts?.totalConfirmed || 0,
      icon: <FiCheckCircle />,
    },
    {
      id: 6,
      key: "rejected",
      path: "/dashboard/tutor/my-applications/cancelled",
      title: "Cancelled Jobs",
      count: counts?.totalRejected || 0,
      icon: <FiXCircle />,
    },
  ];

  const jobStatus = (applicationStatus: string, jobStatus: string) => {
    if (!jobStatus) return "N/A";

    if (jobStatus === "closed") {
      return "Closed";
    }

    if (jobStatus === "live") {
      return "Ongoing";
    }

    if (applicationStatus === "rejected") {
      return "Closed";
    }
    if (applicationStatus === "appointed") {
      return "appointed";
    }

    if (applicationStatus === "confirmed") {
      return "Closed";
    }

    if (applicationStatus === "applied") {
      return "Ongoing";
    }

    if (applicationStatus === "shortlisted") {
      return "Ongoing";
    }

    // if (applicationStatus === "withdrawn") {
    //   return "Ongoing";
    // }

    return "Closed";
  };

  return (
    <div>
      {/* Tabs Bar */}
      <div className="border-b border-blue-300 sticky top-0 z-15 bg-[#F2F5FC] px-3 lg:px-6 pt-6 pb-2">
        <div className="flex w-full overflow-x-auto overflow-y-hidden gap-6 md:gap-10">
          {jobTabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab?.(tab.key)}
                className={`
                  relative py-3 text-xs md:text-sm lg:text-base flex items-center gap-1 md:gap-2
                  font-medium transition-colors duration-200 cursor-pointer
                  ${
                    isActive
                      ? "text-primary-10"
                      : "text-slate-500 hover:text-primary-500"
                  }
                `}
              >
                {/* Icon */}
                <span className="flex items-center justify-center">
                  {React.cloneElement(
                    tab.icon as React.ReactElement,
                    {
                      className: `size-3 md:size-4 ${
                        isActive ? "opacity-100" : "opacity-70"
                      }`,
                    } as any,
                  )}
                </span>

                {/* Label + count */}
                <span className="whitespace-nowrap text-xs md:text-sm lg:text-base">
                  {tab.title}{" "}
                  <span className={isActive ? "font-semibold" : "font-normal"}>
                    {String(tab.count).padStart(2, "0")}
                  </span>
                </span>

                {/* Active underline */}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-primary-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-3 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative overflow-visible">
          {jobs?.map((application) => {
            return (
              <JobCard
                key={application._id}
                variant="status"
                job={application?.job}
                status={jobStatus(
                  application?.status,
                  application?.job?.status,
                )}
                appliedData={{
                  _id: application?._id,
                  appliedOn: application?.appliedOn,
                }}
              />
            );
          })}
        </div>
        <div ref={loaderRef} className=""></div>

        {(isLoading || isFetching) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!applications?.data?.meta?.hasMore && !isFetching && (
          <p className="text-center mt-4 text-gray-400">No applications.</p>
        )}
      </div>
    </div>
  );
};

export default TutorApplications;
