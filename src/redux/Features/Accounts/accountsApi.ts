/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const accountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAccounts: builder.query({
      query: ({
        page,
        limit,
        skip,
        type,
        expenseType,
        paidBy,
        keyword,
        date,
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        page?: number;
        type?: string;
        expenseType?: string;
        paidBy?: string;
        date?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (type) params.append("type", type);
        if (expenseType) params.append("expenseType", expenseType);
        if (paidBy) params.append("paidBy", paidBy);
        if (date) params.append("date", date);

        return {
          url: `/account?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["account"],
    }),

    getSingleAccountById: builder.query({
      query: (id) => ({
        url: `/account/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["account"],
    }),

    addAccount: builder.mutation<any, any>({
      query: (data) => ({
        url: `/account/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["account"],
    }),

    updateAccount: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/account/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["account"],
    }),

    deleteAccount: builder.mutation<any, any>({
      query: (id) => ({
        url: `/account/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["account"],
    }),
  }),
});

export const {
  useGetAllAccountsQuery,
  useGetSingleAccountByIdQuery,
  useAddAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountsApi;
