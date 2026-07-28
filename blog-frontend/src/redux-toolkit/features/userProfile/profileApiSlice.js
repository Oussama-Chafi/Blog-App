import { apiSlice } from "../../app/api/apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/profile/get-profile",
      }),
      transformErrorResponse: (response) => response.data,
      providesTags: ["Profile"],
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/photos/upload-avatar",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "/profile/change-password",
        method: "PATCH",
        body: { oldPassword, newPassword },
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUploadAvatarMutation,
  useChangePasswordMutation,
} = profileApiSlice;
