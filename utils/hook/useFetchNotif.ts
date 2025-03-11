"use client";
import { useQuery } from "@tanstack/react-query";

interface Notification {
  _id: string;
  user_id: string;
  status: "approved" | "pending" | "rejected";
  message: string;
  timestamp: Date;
}

const fetchNotifications = async ({
  authorId,
  limit = 10,
  skip = 0,
}: {
  authorId: string;
  limit?: number;
  skip?: number;
}): Promise<Notification[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append("authorId", authorId);
  if (limit) queryParams.append("limit", limit.toString());
  if (skip) queryParams.append("skip", skip.toString());

  const response = await fetch(`/api/notification?${queryParams}`);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Error fetching notifications: ${response.statusText}`);
  }

  const notifications: Notification[] = await response.json();
  if (!Array.isArray(notifications)) {
    throw new Error("Failed to fetch notifications data");
  }
  return notifications;
};

const useFetchNotif = (authorId: string, limit?: number, skip?: number) => {
  const {
    data: notifications,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["notifications", authorId, limit, skip],
    queryFn: () => fetchNotifications({ authorId, limit, skip }),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { notifications: notifications || [], error, isLoading };
};

export default useFetchNotif;
