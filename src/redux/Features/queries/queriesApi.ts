/* eslint-disable @typescript-eslint/no-explicit-any */
//* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const queriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all queries with filters and pagination
    getAllQueries: builder.query({
      query: ({
        page,
        limit,
        skip,
        status,
        priority,
        queryType,
        keyword,
        dateFrom,
        dateTo,
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        page?: number;
        status?: string;
        priority?: string;
        queryType?: string;
        dateFrom?: string;
        dateTo?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (status) params.append("status", status);
        if (priority) params.append("priority", priority);
        if (queryType) params.append("queryType", queryType);
        if (dateFrom) params.append("dateFrom", dateFrom);
        if (dateTo) params.append("dateTo", dateTo);

        return {
          url: `/query?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["query"],
    }),

    // Get single query by ID
    getSingleQuery: builder.query({
      query: (id) => ({
        url: `/query/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["query"],
    }),

    // Update query (answer query)
    updateQueryStatus: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/query/update-status/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["query"],
    }),

    // Delete query
    deleteQuery: builder.mutation<any, string>({
      query: (id) => ({
        url: `/query/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["query"],
    }),

    // Answer a query (update status and add answer)
    answerQuery: builder.mutation<any, { id: string; answer: string }>({
      query: ({ id, answer }) => ({
        url: `/query/answer/${id}`,
        method: "PATCH",
        body: { answer, status: "Answered" },
        credentials: "include",
      }),
      invalidatesTags: ["query"],
    }),
  }),
});

export const {
  useGetAllQueriesQuery,
  useGetSingleQueryQuery,
  useUpdateQueryStatusMutation,
  useDeleteQueryMutation,
  useAnswerQueryMutation,
} = queriesApi;