/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add new meeting
    addMeeting: builder.mutation<any, any>({
      query: (data) => ({
        url: `/calendar/add-meeting`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["calendar"],
    }),

    // Get my calendar meetings
    getMyCalendar: builder.query({
      query: ({
        page,
        limit,
        skip,
        keyword,
        status,
        date,
        dateFrom,
        dateTo,
        month,
        year,
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        page?: number;
        status?: string;
        date?: string;
        dateFrom?: string;
        dateTo?: string;
        month?: number;
        year?: number;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (status) params.append("status", status);
        if (date) params.append("date", date);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);
        if (typeof month === "number") params.append("month", month.toString());
        if (typeof year === "number") params.append("year", year.toString());

        return {
          url: `/calendar/my?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["calendar"],
    }),

    // Get single meeting by ID
    getSingleMeeting: builder.query({
      query: (meetingId) => ({
        url: `/calendar/${meetingId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["calendar"],
    }),

    // Update meeting
    updateMeeting: builder.mutation<any, any>({
      query: ({ meetingId, data }) => ({
        url: `/calendar/update-meeting/${meetingId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["calendar"],
    }),

    // Update meeting status
    updateMeetingStatus: builder.mutation<any, any>({
      query: ({ meetingId, status }) => ({
        url: `/calendar/update-status/${meetingId}`,
        method: "PATCH",
        body: { status },
        credentials: "include",
      }),
      invalidatesTags: ["calendar"],
    }),

    // Delete meeting
    deleteMeeting: builder.mutation<any, any>({
      query: (meetingId) => ({
        url: `/calendar/delete/${meetingId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["calendar"],
    }),
  }),
});

export const {
  useAddMeetingMutation,
  useGetMyCalendarQuery,
  useGetSingleMeetingQuery,
  useUpdateMeetingMutation,
  useUpdateMeetingStatusMutation,
  useDeleteMeetingMutation,
} = calendarApi;