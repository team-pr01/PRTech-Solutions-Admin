/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllApplications: builder.query({
      query: ({
        page,
        limit,
        status,
        keyword,
        demoDate
      }: {
        keyword?: string;
        limit?: number;
        page?: number;
        status?: string;
        demoDate?: string
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (status) params.append("status", status);
        if (demoDate) params.append("demoDate", demoDate);

        return {
          url: `/application?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["notification", "application"],
    }),

    getSingleApplicationById: builder.query({
      query: (id) => ({
        url: `/application/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["application"],
    }),

    getAllApplicationsByJobId: builder.query<
      any,
      {
        jobId: string;
        keyword?: string;
        status?: string;
        page?: number;
        limit?: number;
        demoDate?: string
      }
    >({
      query: ({ jobId, keyword, status = "", page = 1, limit = 10, demoDate }) => {
        let url = `/application/job/${jobId}?page=${page}&limit=${limit}`;

        // always pass status (empty string if not provided)
        url += `&status=${encodeURIComponent(status)}`;

        if (demoDate) {
          url += `&demoDate=${encodeURIComponent(demoDate)}`;
        }

        if (keyword) {
          url += `&keyword=${encodeURIComponent(keyword)}`;
        }

        return {
          url,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["application"],
    }),

    getAllApplicationOfATutor: builder.query<
      any,
      { userId: string; skip?: number; limit?: number; status?: string }
    >({
      query: ({ userId, skip = 0, limit = 10, status }) => {
        const url = `/application/tutor/${userId}?skip=${skip}&limit=${limit}&status=${status}`;
        return {
          url,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["application"],
    }),

    applyOnJob: builder.mutation<any, any>({
      query: (data) => ({
        url: `/application/apply`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["tutor", "application", "jobs"],
    }),

    withdrawApplication: builder.mutation({
      query: (id) => ({
        url: `/application/withdraw/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["tutor", "application", "jobs"],
    }),

    shortlistTutor: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/application/shortlist/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["application"],
    }),

    appointTutor: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/application/appoint/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["application"],
    }),

    rejectTutor: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/application/reject/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["application"],
    }),

    confirmTutor: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/application/confirm/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["application"],
    }),

    updateDemoDate: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/application/update-demo-date/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["application"],
    }),

    updateFollowUpStatus: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/application/update-followup-status/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["application"],
    }),
  }),
});

export const {
  useGetAllApplicationsQuery,
  useGetSingleApplicationByIdQuery,
  useGetAllApplicationsByJobIdQuery,
  useGetAllApplicationOfATutorQuery,
  useApplyOnJobMutation,
  useWithdrawApplicationMutation,
  useShortlistTutorMutation,
  useAppointTutorMutation,
  useRejectTutorMutation,
  useConfirmTutorMutation,
  useUpdateDemoDateMutation,
  useUpdateFollowUpStatusMutation,
} = applicationApi;
