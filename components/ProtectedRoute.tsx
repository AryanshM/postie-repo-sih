import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';

import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedType: string;
}

const ProtectedRoute = ({ children, allowedType }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      const userType = await SecureStore.getItemAsync('type');
        console.log('User Type:', userType);
        console.log('Allowed Type:', allowedType);
      if (String(userType) === allowedType) {
        console.log('Authorized');
        setAuthorized(true);
      } else {
        console.log('Unauthorized');
        router.replace('/(auth)/Login'); 
      }
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return authorized ? children : null;
};

export default ProtectedRoute;
