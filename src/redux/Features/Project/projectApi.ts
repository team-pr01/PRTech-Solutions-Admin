/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: ({
        page,
        limit,
        skip,
        status,
        keyword,
        projectType,
      }: {
        keyword?: string;
        limit?: number;
        skip?: number;
        page?: number;
        status?: string;
        projectType?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (typeof page === "number") params.append("page", page.toString());
        if (status) params.append("status", status);
        if (projectType) params.append("projectType", projectType);

        return {
          url: `/project?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["project"],
    }),

    getSingleProjectById: builder.query({
      query: (id) => ({
        url: `/project/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["project"],
    }),

    addProject: builder.mutation<any, any>({
      query: (data) => ({
        url: `/project/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["project"],
    }),

    updateProject: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/project/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["project"],
    }),

    deleteProject: builder.mutation<any, any>({
      query: (id) => ({
        url: `/project/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["project"],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useGetSingleProjectByIdQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation
} = projectApi;
