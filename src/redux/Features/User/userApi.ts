import { baseApi } from "../../API/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: `/user/me`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["users"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/update-profile`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    deleteAccount: builder.mutation({
      query: (data) => ({
        url: `/user/delete-account`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    restoreDeletedAccount: builder.mutation({
      query: (id) => ({
        url: `/user/account/restore/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    suspendUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/user/suspend/${userId}`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    activeUser: builder.mutation({
      query: (userId) => ({
        url: `/user/active/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    requestToUnlockProfile: builder.mutation({
      query: (data) => ({
        url: `/user/request-to-unlock-profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    toggleProfileStatus: builder.mutation({
      query: (id) => ({
        url: `/user/profile-lock/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    giveRating: builder.mutation({
      query: ({ data, id }) => ({
        url: `/user/give-rating/${id}`,
        body: data,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const { useGetMeQuery, useUpdateProfileMutation, useDeleteAccountMutation, useRestoreDeletedAccountMutation, useSuspendUserMutation, useActiveUserMutation, useRequestToUnlockProfileMutation, useToggleProfileStatusMutation, useGiveRatingMutation } = userApi;
