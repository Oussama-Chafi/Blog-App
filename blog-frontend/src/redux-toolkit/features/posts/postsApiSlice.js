import { apiSlice } from "../../app/api/apiSlice";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: ({ page, limit, search }) =>
        `/posts/all-posts?page=${page}&limit=${limit}&search=${search}`,
      transformResponse: (response) => response.data,
      providesTags: ["posts"],
    }),
    createPost: builder.mutation({
      query: ({ title, content, postPhoto, imagePublicId }) => ({
        url: "/posts/add",
        method: "POST",
        body: { title, content, postPhoto, imagePublicId },
      }),
      invalidatesTags: ["posts"],
    }),
    getOnePost: builder.query({
      query: (id) => `posts/get/${id}`,
      providesTags: ["posts"],
      transformResponse: (response) => response.data,
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/delete/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["posts"],
    }),
    updatePost: builder.mutation({
      query: ({ id, finalUpdateData }) => ({
        url: `/posts/update/${id}`,
        method: "POST",
        body: finalUpdateData,
      }),
      invalidatesTags: ["posts"],
    }),
    getMyPosts: builder.query({
      query: ({ page, limit, search }) =>
        `/posts/my-posts?page=${page}&limit=${limit}&search=${search}`,
      transformResponse: (response) => response.data,
      providesTags: ["posts"],
    }),
    uploadPostPhoto: builder.mutation({
      query: (formData) => ({
        url: "/photos/upload-post-photo",
        method: "POST",
        body: formData,
      }),
    }),
    updatePostPhoto: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/photos/${id}/update-post-photo`,
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetPostQuery,
  useCreatePostMutation,
  useGetOnePostQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
  useGetMyPostsQuery,
  useUploadPostPhotoMutation,
  useUpdatePostPhotoMutation,
} = postApiSlice;
