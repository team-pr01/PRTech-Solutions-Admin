/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../API/baseApi";

const blogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: ({
        page,
        limit,
        skip,
        keyword,
        category,
      }: {
        limit?: number;
        skip?: number;
        page?: number;
        keyword?: string;
        category?: string;
      } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (category) params.append("category", category);
        if (typeof limit === "number") params.append("limit", limit.toString());
        if (typeof skip === "number") params.append("skip", skip.toString());
        if (typeof page === "number") params.append("page", page.toString());

        return {
          url: `/blog?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["blog"],
    }),

    getSingleBlogById: builder.query({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["blog"],
    }),

    getSingleBlogBySlug: builder.query({
      query: (slug) => ({
        url: `/blog/slug/${slug}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["blog"],
    }),

    addBlog: builder.mutation<any, any>({
      query: (data) => ({
        url: `/blog/add`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["blog"],
    }),

    updateBlog: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/blog/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["blog"],
    }),

    deleteBlog: builder.mutation<any, any>({
      query: (id) => ({
        url: `/blog/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["blog"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetSingleBlogByIdQuery,
  useGetSingleBlogBySlugQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogsApi;
