import { apiSlice } from "../../app/api/apiSlice";
import { logout } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
      }),
    }),
    sendLougout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    verifyEmail: builder.mutation({
      query: (verificationToken) => ({
        url: `/auth/verify-email?token=${verificationToken}`,
        method: "GET",
      }),
    }),
    forgetPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: { ...email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({newPassword,resetToken}) => ({
        url: `/auth/reset-password?token=${resetToken}`,
        method: "POST",
        body: {newPassword },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useSendLougoutMutation,
  useVerifyEmailMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
