import { apiSlice } from "../../app/api/apiSlice";

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: (id) => `/posts/${id}/all-comments`,
      transformResponse: (response) => response.data,
      providesTags: ["comments"],
    }),
    deleteComment: builder.mutation({
      query: ({ id, commentId }) => ({
        url: `posts/${id}/delete-comment/${commentId}`,
        method: "POST",
      }),
      invalidatesTags: ["comments"],
    }),
    addComment: builder.mutation({
      query: ({ id, content }) => ({
        url: `/posts/${id}/add-comment`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["comments"],
    }),
    updateComment: builder.mutation({
      query: ({ id, commentId , content}) => ({
        url: `/posts/${id}/update-comment/${commentId}`,
        method: "POST",
        body: { content},
      }),
      invalidatesTags: ["comments"],
    }),
    getOneComment: builder.query({
      query: (id) => `/posts/${id}/get-comment`,
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useDeleteCommentMutation,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useGetOneCommentQuery,
} = commentApiSlice;
