import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";
const baseUrl = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
// if the access Token has expired this function work to get a new access token 
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseUrl(args, api, extraOptions);
  if (result?.error?.status === 403) {
    const refreshApi = await baseUrl("/auth/refresh", api, extraOptions);
    if (refreshApi?.data) {
      api.dispatch(
        setCredentials({
          user: refreshApi?.data?.user,
          token: refreshApi?.data?.accessToken,
        }),
      );
      result = await baseUrl(args, api, extraOptions);
    } else {
      if (refreshApi?.data?.status === 403) {
        refreshApi?.data?.message | "your login has expired";
      }
      return refreshApi;
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});
