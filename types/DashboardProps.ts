interface UserData {
  name: string;
  role: string;
  image: string;
}

interface DashboardProps {
  user: UserData | null;
}
