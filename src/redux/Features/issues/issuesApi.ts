/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const issuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========== ISSUES APIs ==========

    // Get all issues with filters and pagination
    getAllIssues: builder.query({
      query: ({
        page,
        limit,
        skip,
        status,
        priority,
        category,
        keyword,
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        page?: number;
        status?: string;
        priority?: string;
        category?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (status) params.append("status", status);
        if (priority) params.append("priority", priority);
        if (category) params.append("category", category);

        return {
          url: `/issue?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["issue"],
    }),

    // Get single issue by ID
    getSingleIssue: builder.query({
      query: (id) => ({
        url: `/issue/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["issue"],
    }),

    // Get my queries (for logged-in user)
    getMyRaisedIssues: builder.query({
      query: ({
        page,
        limit,
        skip,
        status,
        priority
      }: {
        page?: number;
        limit?: number;
        skip?: number;
        status?: string;
        priority?: string
      } = {}) => {
        const params = new URLSearchParams();
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (status) params.append("status", status);
        if (priority) params.append("priority", priority);

        return {
          url: `/issue/my-issues?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["issue"],
    }),

    // Add new issue (raise issue)
    addIssue: builder.mutation<any, any>({
      query: (data) => ({
        url: `/issue/raise`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["issue"],
    }),

    // Update issue
    updateIssueStatus: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/issue/update-status/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["issue"],
    }),

    // Delete issue
    deleteIssue: builder.mutation<any, any>({
      query: (id) => ({
        url: `/issue/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["issue"],
    }),

    // Get issue statistics
    getIssueStatistics: builder.query({
      query: () => ({
        url: `/issue/statistics`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["issue"],
    }),

    // Upload issue attachments
    uploadIssueAttachments: builder.mutation<any, any>({
      query: ({ id, files }) => {
        const formData = new FormData();
        files.forEach((file: File) => {
          formData.append("attachments", file);
        });
        return {
          url: `/issue/${id}/attachments`,
          method: "POST",
          body: formData,
          credentials: "include",
        };
      },
      invalidatesTags: ["issue"],
    }),

    // Delete issue attachment
    deleteIssueAttachment: builder.mutation<any, any>({
      query: ({ issueId, attachmentId }) => ({
        url: `/issue/${issueId}/attachments/${attachmentId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["issue"],
    }),
  }),
});

export const {
  useGetAllIssuesQuery,
  useGetSingleIssueQuery,
  useGetMyRaisedIssuesQuery,
  useAddIssueMutation,
  useUpdateIssueStatusMutation,
  useDeleteIssueMutation,
  useGetIssueStatisticsQuery,
  useUploadIssueAttachmentsMutation,
  useDeleteIssueAttachmentMutation,
} = issuesApi;