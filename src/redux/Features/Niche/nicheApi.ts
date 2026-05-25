/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const nicheApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Get all niches
    getAllNiches: builder.query({
      query: () => ({
        url: `/niche`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["niche"],
    }),

    // Get single niche by ID
    getSingleNiche: builder.query({
      query: (id) => ({
        url: `/niche/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["niche"],
    }),

    // Add new niche
    addNiche: builder.mutation<any, any>({
      query: (data) => ({
        url: `/niche/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["niche"],
    }),

    // Update niche
    updateNiche: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/niche/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["niche"],
    }),

    // Delete niche
    deleteNiche: builder.mutation<any, string>({
      query: (id) => ({
        url: `/niche/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["niche"],
    }),
  }),
});

export const {
  useGetAllNichesQuery,
  useGetSingleNicheQuery,
  useAddNicheMutation,
  useUpdateNicheMutation,
  useDeleteNicheMutation,
} = nicheApi;