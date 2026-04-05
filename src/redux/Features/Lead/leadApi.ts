/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const leadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: ({
        page,
        limit,
        skip,
        status,
        keyword,
        country,
        city,
        category,
        priority,
        discoveryCallScheduledDate,
        followUpDate
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        page?: number;
        status?: string;
        country?: string;
        city?: string;
        category?: string;
        priority?: string;
        discoveryCallScheduledDate?: string;
        followUpDate?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (status) params.append("status", status);
        if (country) params.append("country", country);
        if (city) params.append("city", city);
        if (category) params.append("category", category);
        if (priority) params.append("priority", priority);
        if (discoveryCallScheduledDate) params.append("discoveryCallScheduledDate", discoveryCallScheduledDate);
        if (followUpDate) params.append("followUpDate", followUpDate);

        return {
          url: `/lead?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["lead"],
    }),

    getSingleLeadById: builder.query({
      query: (id) => ({
        url: `/lead/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["lead"],
    }),

    addLead: builder.mutation<any, any>({
      query: (data) => ({
        url: `/lead/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["lead"],
    }),

    updateLead: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/lead/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["lead"],
    }),

    deleteLead: builder.mutation<any, any>({
      query: (id) => ({
        url: `/lead/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["lead"],
    }),

    scheduleDiscoveryCall: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/lead/schedule-discovery-call/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["lead"],
    }),

    addFollowUp: builder.mutation<any, any>({
      query: ({ leadId, data }) => ({
        url: `/lead/${leadId}/follow-ups/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["lead"],
    }),

    deleteFollowUp: builder.mutation<any, any>({
      query: ({ leadId, followUpId }) => ({
        url: `/lead/${leadId}/follow-ups/delete/${followUpId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["lead"],
    }),
  }),
});

export const {
  useGetAllLeadsQuery,
  useGetSingleLeadByIdQuery,
  useAddLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useScheduleDiscoveryCallMutation,
  useAddFollowUpMutation,
  useDeleteFollowUpMutation,
} = leadApi;
