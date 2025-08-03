import { useConvex } from "convex/react";
import { useQuery as useTanstackQuery, useQueryClient } from '@tanstack/react-query';
import { api } from "../../convex/_generated/api";

export const PROJECTS_QUERY_KEY = ['allProjects'];

export function useAllProjectsQuery() {
  const convex = useConvex();

  return useTanstackQuery({
    queryKey: PROJECTS_QUERY_KEY,
    // Đây là function fetch, chứ không phải object query!
    queryFn: () => convex.query(api.containProjects.containProjects.getAllProjects, {}),
    staleTime: 1000 * 60 * 5, // 5 phút
  });
}

// Custom hook để invalidate projects cache
export function useInvalidateProjects() {
  const queryClient = useQueryClient();
  
  return () => {
    return queryClient.invalidateQueries({ 
      queryKey: PROJECTS_QUERY_KEY 
    });
  };
}

// Custom hook để refetch projects
export function useRefetchProjects() {
  const queryClient = useQueryClient();
  
  return () => {
    return queryClient.refetchQueries({ 
      queryKey: PROJECTS_QUERY_KEY 
    });
  };
}
