/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../../API/baseApi";

const scheduleCallApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllScheduleCalls: builder.query({
      query: ({
        keyword,
        limit,
        page,
        skip,
        status,
        scheduledDate
      }: {
        keyword?: string;
        limit?: number;
        page?: number;
        skip?: number;
        status?: string;
        scheduledDate?: string
      } = {}) => {
        const params = new URLSearchParams();

        // Handle keyword - skip if "All"
        if (keyword && keyword !== "All") {
          params.append("keyword", keyword);
        }

        // Handle limit
        if (typeof limit === "number") params.append("limit", limit.toString());

        // Handle page
        if (typeof page === "number") params.append("page", page.toString());

        // Handle skip
        if (typeof skip === "number") params.append("skip", skip.toString());

        // Handle status - skip if "All" or empty
        if (status && status !== "All") {
          params.append("status", status);
        }

        // Handle scheduledDate
        if (scheduledDate) {
          params.append("scheduledDate", scheduledDate);
        }

        return {
          url: `/scheduled-call?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["scheduledCalls"],
    }),

    getSingleScheduledCall: builder.query({
      query: (id) => ({
        url: `/scheduled-call/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["scheduledCalls"],
    }),

    updateScheduledCall: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/scheduled-call/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["scheduledCalls"],
    }),

    deleteScheduledCall: builder.mutation<any, any>({
      query: (id) => ({
        url: `/scheduled-call/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["scheduledCalls"],
    }),
  }),
});

export const {
  useGetAllScheduleCallsQuery,
  useGetSingleScheduledCallQuery,
  useUpdateScheduledCallMutation,
  useDeleteScheduledCallMutation,
} = scheduleCallApi;
