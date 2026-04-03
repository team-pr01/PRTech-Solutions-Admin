/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllClients: builder.query({
      query: ({
        page,
        limit,
        status,
        keyword,
        source,
        industry,
        country
      }: {
        keyword?: string;
        limit?: number;
        page?: number;
        status?: string;
        source?: string;
        industry?: string;
        country?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (status) params.append("status", status);
        if (source) params.append("source", source);
        if (industry) params.append("industry", industry);
        if (country) params.append("country", country);

        return {
          url: `/client?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["client"],
    }),

    getSingleClientById: builder.query({
      query: (id) => ({
        url: `/client/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["client"],
    }),

    addClient: builder.mutation<any, any>({
      query: (data) => ({
        url: `/client/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["client"],
    }),

    updateClient: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/client/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["client"],
    }),

    deleteClient: builder.mutation<any, any>({
      query: (id) => ({
        url: `/client/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["client"],
    }),

    addSubordinate: builder.mutation<any, any>({
      query: ({ clientId, data }) => ({
        url: `/client/${clientId}/subordinate/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["client"],
    }),

    updateSubordinate: builder.mutation<any, any>({
      query: ({ clientId, subordinateId, data }) => ({
        url: `/client/${clientId}/subordinate/update/${subordinateId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["client"],
    }),

    deleteSubordinate: builder.mutation<any, any>({
      query: ({ clientId, subordinateId, data }) => ({
        url: `/client/${clientId}/subordinate/delete/${subordinateId}`,
        method: "DELETE",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["client"],
    }),
  }),
});

export const {
  useGetAllClientsQuery,
  useGetSingleClientByIdQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useAddSubordinateMutation,
  useUpdateSubordinateMutation,
  useDeleteSubordinateMutation,
} = clientApi;
