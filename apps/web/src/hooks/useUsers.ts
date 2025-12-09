import { useState, useEffect } from "react";
import { authApi } from "@/services/apiClient";

interface User {
  _id: string;
  displayName: string;
  email: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // authApi.getUsers is likely admin only, but maybe there's a simpler list for dropdowns?
        // If not, we might need a specific endpoint or just handle the error gracefully.
        // Assuming authApi.getUsers returns ListResponse<AuthUser> based on apiClient.ts
        const response = await authApi.getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { users, loading };
}
