import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Simple signup hook
export const useSignup = () => {
	return useMutation({
		mutationFn: async (payload: { name: string; email: string; password: string; number?: string }) => {
			const resp = await axios.post("/auth/signup", payload);
			if (resp.status !== 200 && resp.status !== 201) {
				throw new Error("Signup failed");
			}
			return resp.data;
		},
	});
};

// Simple login hook
export const useLogin = () => {
	return useMutation({
		mutationFn: async (payload: { email: string; password: string }) => {
			const resp = await axios.post("/auth/login", payload);
			if (resp.status !== 200 && resp.status !== 201) {
				throw new Error("Login failed");
			}
			return resp.data;
		},
	});
};
