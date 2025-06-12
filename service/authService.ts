// import { account } from "@/lib/appwrite";
// import { ID, Models } from "react-native-appwrite";

// type ServiceSuccess = { success: true };
// type ServiceError = { error: string };
// type AuthResponse = ServiceSuccess | ServiceError;

// const authService = {
//   async register(email: string, password: string): Promise<AuthResponse> {
//     try {
//       await account.create(ID.unique(), email, password);
//       return { success: true };
//     } catch (error: any) {
//       return {
//         error: error?.message || "Registration failed. Please try again",
//       };
//     }
//   },

//   async login(email: string, password: string): Promise<AuthResponse> {
//     try {
//       await account.createEmailPasswordSession(email, password);
//       return { success: true };
//     } catch (error: any) {
//       return {
//         error: error?.message || "Login failed. Please try again",
//       };
//     }
//   },

//   async getUser(): Promise<Models.User<Models.Preferences> | null> {
//     try {
//       return await account.get();
//     } catch {
//       return null;
//     }
//   },

//   async logout(): Promise<void> {
//     try {
//       await account.deleteSession("current");
//     } catch (error) {
//       console.error(error);
//     }
//   },
// };

// export default authService;
