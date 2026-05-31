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

    addPhase: builder.mutation<any, any>({
      query: ({projectId, data}) => ({
        url: `/project/phases/add/${projectId}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["project"],
    }),

    getAllPhases: builder.query({
      query: (id) => ({
        url: `/project/phases/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["project"],
    }),

    getSinglePhaseById: builder.query({
      query: ({ projectId, phaseId }) => ({
        url: `/project/phases/${projectId}/${phaseId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["project"],
    }),

    updatePhase: builder.mutation<any, any>({
      query: ({ projectId, phaseId, data }) => ({
        url: `/project/phases/update/${projectId}/${phaseId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["project"],
    }),

    addInstallment: builder.mutation<any, any>({
      query: ({ projectId, phaseId, data }) => ({
        url: `/project/${projectId}/phases/${phaseId}/installments/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["project"],
    }),

    updateInstallment: builder.mutation<any, any>({
      query: ({ projectId, phaseId, installmentId, data }) => ({
        url: `/project/${projectId}/phases/${phaseId}/installments/update/${installmentId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["project"],
    }),

    deletePhase: builder.mutation<any, any>({
      query: ({ projectId, phaseId }) => ({
        url: `/project/phases/delete/${projectId}/${phaseId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["project"],
    }),

    addExpenditure: builder.mutation<any, any>({
      query: ({ projectId, data }) => ({
        url: `/project/${projectId}/expenditure/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["project"],
    }),

    addPhaseInExpenditure: builder.mutation<any, any>({
      query: ({ projectId, expenditureId, data }) => ({
        url: `/project/${projectId}/expenditure/${expenditureId}/phases/add`,
        method: "POST",
        body: data,
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
  useDeleteProjectMutation,
  useAddPhaseMutation,
  useGetAllPhasesQuery,
  useGetSinglePhaseByIdQuery,
  useUpdatePhaseMutation,
  useAddInstallmentMutation,
  useUpdateInstallmentMutation,
  useDeletePhaseMutation,
  useAddExpenditureMutation,
  useAddPhaseInExpenditureMutation,
} = projectApi;
