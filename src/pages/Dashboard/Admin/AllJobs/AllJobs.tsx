/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import AllJobFilters from "../../../../components/Admin/AllJobsPage/AllJobFilters/AllJobFilters";
import { useDebounce } from "../../../../hooks/useDebounce";
import { useGetAllJobsQuery } from "../../../../redux/Features/Job/jobApi";
import Jobs from "../../../../components/JobBoardPage/Jobs/Jobs";
import JobCardSkeleton from "../../../../components/JobBoardPage/Jobs/JobCard/JobCardSkeleton";
import {
  FaBriefcase,
  FaClock,
  FaBullhorn,
  // FaListUl,
  // FaUserCheck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import DashboardOverviewCard from "../../../../components/Dashboard/DashboardOverviewCard/DashboardOverviewCard";
import { useParams } from "react-router-dom";
import { useNavigatePathForAdmin } from "../../../../utils/navigatePathForAdmin";

const AllJobs = () => {
  const { jobStatus } = useParams();
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<string>(jobStatus || "");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [areaOptions, setAreaOptions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCurriculums, setSelectedCurriculums] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [jobIdFrom, setJobIdFrom] = useState<string>("");
  const [jobIdTo, setJobIdTo] = useState<string>("");

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTutorGender, setSelectedTutorGender] = useState<string[]>([]);
  const [selectedStudentGender, setSelectedStudentGender] = useState<string[]>(
    []
  );
  const [selectedTuitionType, setSelectedTuitionType] = useState<string[]>([]);
  const debouncedKeyword = useDebounce(keyword, 500);

  // Pagination states
  const [skip, setSkip] = useState(0);
  const limit = 6;
  const [jobs, setJobs] = useState<any[]>([]);

  const {
    data: allJobs,
    isLoading,
    isFetching,
  } = useGetAllJobsQuery({
    keyword:
      debouncedKeyword && debouncedKeyword.trim().length > 0
        ? debouncedKeyword.trim()
        : undefined,
    status: status || undefined,
    city: selectedCities.join(",") || undefined,
    area: selectedAreas.join(",") || undefined,
    category: selectedCategories.join(",") || undefined,
    class: selectedClasses.join(",") || undefined,
    curriculum: selectedCurriculums.join(",") || undefined,
    tutoringDays: selectedDays.join(",") || undefined,
    preferredTutorGender: selectedTutorGender.join(",") || undefined,
    studentGender: selectedStudentGender.join(",") || undefined,
    tuitionType: selectedTuitionType.join(",") || undefined,
    skip,
    jobIdFrom,
    jobIdTo,
  });

  useEffect(() => {
    setStatus(jobStatus || "");
  }, [jobStatus]);

  // Update jobs when new data arrives
  useEffect(() => {
    if (allJobs?.data?.jobs) {
      if (skip === 0) {
        setJobs(allJobs.data.jobs);
      } else {
        setJobs((prev) => {
          const newJobs = allJobs.data.jobs.filter(
            (job: any) => !prev.some((p) => p._id === job._id)
          );
          return [...prev, ...newJobs];
        });
      }
    }
  }, [allJobs, skip]);

  // Reset pagination when filters or search change
  useEffect(() => {
    setSkip(0);
  }, [
    debouncedKeyword,
    selectedCities,
    selectedAreas,
    selectedCategories,
    selectedCurriculums,
    selectedDays,
    selectedClasses,
    selectedTutorGender,
    selectedStudentGender,
    selectedTuitionType,
    status,
    jobIdFrom,
    jobIdTo,
  ]);

  // Infinite Scroll Observer
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetching &&
          allJobs?.data?.meta?.hasMore
        ) {
          setSkip((prev) => prev + limit);
        }
      },
      { threshold: 1 }
    );

    const node = loaderRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [allJobs, isFetching, allJobs?.data?.meta?.hasMore]);

  const jobsData = allJobs?.data || [];
  const jobStats = {
    totalJobs: jobsData?.meta?.total || 0,
    pendingJobs: jobsData?.meta?.pendingJobs || 0,
    liveJobs: jobsData?.meta?.liveJobs || 0,
    shortlistedJobs: jobsData?.meta?.shortlistedJobs || 0,
    appointedJobs: jobsData?.meta?.appointedJobs || 0,
    totalConfirmedJob: jobsData?.meta?.closedJobs || 0,
    totalCancelledJob: jobsData?.meta?.cancelledJobs || 0,
  };

  const navigatePath = useNavigatePathForAdmin();

  return (
    <div>
      <div className="sticky top-0 z-15 px-3 lg:px-6 pt-6 bg-[#F2F5FC]">
        <AllJobFilters
          keyword={keyword}
          setKeyword={setKeyword}
          selectedCities={selectedCities}
          setSelectedCities={setSelectedCities}
          selectedAreas={selectedAreas}
          setSelectedAreas={setSelectedAreas}
          areaOptions={areaOptions}
          setAreaOptions={setAreaOptions}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedCurriculums={selectedCurriculums}
          setSelectedCurriculums={setSelectedCurriculums}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          selectedTutorGender={selectedTutorGender}
          setSelectedTutorGender={setSelectedTutorGender}
          selectedStudentGender={selectedStudentGender}
          setSelectedStudentGender={setSelectedStudentGender}
          selectedTuitionType={selectedTuitionType}
          setSelectedTuitionType={setSelectedTuitionType}
          liveJobs={allJobs?.data?.meta?.liveJobs || 0}
          status={status}
          jobIdFrom={jobIdFrom}
          setJobIdFrom={setJobIdFrom}
          jobIdTo={jobIdTo}
          setJobIdTo={setJobIdTo}
          setStatus={setStatus}
        />
      </div>

      <div className="px-3 lg:px-6 pb-6 space-y-5">
        <div className="grid grid-cols-5 md:grid-cols-3 xl:grid-cols-4 gap-5">
          <DashboardOverviewCard
            title="All"
            additionalTitle="Jobs"
            value={jobStats.totalJobs}
            textColor="text-neutral-10"
            path={`/dashboard/${navigatePath}/all-jobs/all`}
            icon={<FaBriefcase className="text-white md:text-[#6366F1]" />}
          />

          <DashboardOverviewCard
            title="Pending"
            additionalTitle="Jobs"
            value={jobStats.pendingJobs}
            textColor="text-neutral-10"
            path={`/dashboard/${navigatePath}/all-jobs/pending`}
            icon={<FaClock className="text-white md:text-[#F59E0B]" />}
          />

          <DashboardOverviewCard
            title="Live"
            additionalTitle="Jobs"
            value={jobStats.liveJobs}
            textColor="text-neutral-10"
            path={`/dashboard/${navigatePath}/all-jobs/live`}
            icon={<FaBullhorn className="text-white md:text-[#3B82F6]" />}
          />

          {/* <DashboardOverviewCard
            title="Shortlisted"
            additionalTitle="Jobs"
            value={jobStats.shortlistedJobs}
            textColor="text-neutral-10"
            path="/dashboard/admin/all-jobs/shortlisted"
            icon={<FaListUl className="text-[#8B5CF6]" />}
          /> */}

          {/* <DashboardOverviewCard
            title="Appointed"
            additionalTitle="Jobs"
            value={jobStats.appointedJobs}
            textColor="text-neutral-10"
            path="/dashboard/admin/all-jobs/all"
            icon={<FaUserCheck className="text-[#10B981]" />}
          /> */}

          <DashboardOverviewCard
            title="Confirmed"
            additionalTitle="Jobs"
            value={jobStats.totalConfirmedJob}
            textColor="text-neutral-10"
            path={`/dashboard/${navigatePath}/all-jobs/closed`}
            icon={<FaCheckCircle className="text-white md:text-[#22C55E]" />}
          />

          <DashboardOverviewCard
            title="Cancelled"
            additionalTitle="Jobs"
            value={jobStats.totalCancelledJob}
            textColor="text-neutral-10"
            path={`/dashboard/${navigatePath}/all-jobs/cancelled`}
            icon={<FaTimesCircle className="text-white md:text-[#EF4444]" />}
          />
        </div>

        <Jobs
          allJobs={jobs}
          isLoading={isLoading || isFetching}
          variant="admin"
        />
        <div ref={loaderRef} className="h-10"></div>

        {allJobs?.data?.meta?.hasMore && isFetching && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!allJobs?.data?.meta?.hasMore && !isFetching && (
          <p className="text-center mt-4 text-gray-400">
            No more jobs to load.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllJobs;
