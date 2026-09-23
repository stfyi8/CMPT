
//DO NOT TOUCH THIS FILE
import "global.css"
import { AuthContextProvider, useAuth } from 'context/authContext'
import { Slot, useSegments, useRouter } from "expo-router";
import { useEffect } from 'react';
import { ReminderProvider } from '../components/Reminder';
import { AutoDeleteProvider } from "../components/AutoDelete";
import { ConstProvider } from "../components/Const";


const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated === 'undefined') return;

    const inApp = segments[0] === '(app)';

    if (isAuthenticated && !inApp) {
      router.replace('/ToDo');
    }
    else if (!isAuthenticated && segments[0] === undefined) {
      router.replace('/SignIn');
    }
    else if (!isAuthenticated && inApp) {
      router.replace('/SignIn');
    }
  }, [isAuthenticated, segments, router]);

  return <Slot />
}
export default function RootLayout() {
  return (
    <AuthContextProvider>
      <ReminderProvider>
        <AutoDeleteProvider>
          <ConstProvider>
            <MainLayout />
          </ConstProvider>
        </AutoDeleteProvider>
      </ReminderProvider>
    </AuthContextProvider>

  );
};

