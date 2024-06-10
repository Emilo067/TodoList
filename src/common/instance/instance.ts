import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "845a7512-7ea3-4d78-b9e5-2066f67a35cc",
  },
});
