interface UserData {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface DashboardProps {
  user: UserData | null;
}
