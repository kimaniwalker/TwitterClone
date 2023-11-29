import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountScreen from '@/screens/AccountScreen';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import {
    QueryClientProvider,
} from '@tanstack/react-query'
import { queryClient } from '@/utils/queryClient';
import CirclesScreen from '@/screens/CirclesScreen';
import { createStackNavigator, } from '@react-navigation/stack';
import { RootStackParamList } from '@/utils/types';
import MessagesScreen from '@/screens/MessagesScreen';
import Header from '@/components/Circles/Header';
import CreateScreen from '@/screens/CreateScreen';
import React from 'react';
import { useUserPreferenceContext } from './context/userPreferences';
import NewMessage from '@/components/Circles/NewMessage';

const Tab = createBottomTabNavigator();

export default function Screens() {
    const Stack = createStackNavigator<RootStackParamList>();
    const { hideTabNavigation } = useUserPreferenceContext()
    console.log({ hideTabNavigation })

    function MyStack() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Chats" component={CirclesScreen} options={{ header: ({ navigation }) => <Header navigation={navigation} /> }} />
                <Stack.Screen name="Messages" component={MessagesScreen} />
                <Stack.Screen name="CreateNewChat" component={CreateScreen} />
            </Stack.Navigator>
        );
    }

    return (
        <NavigationContainer>
            <QueryClientProvider client={queryClient}>
                <Tab.Navigator tabBar={hideTabNavigation ? () => <NewMessage /> : undefined}>
                    <Tab.Screen name="Account" component={AccountScreen} options={{
                        tabBarIcon: () => <MaterialIcons name="account-circle" size={24} color="black" />
                    }} />
                    <Tab.Screen name="Circles" component={MyStack} options={{
                        headerShown: false,
                        tabBarIcon: () => <MaterialCommunityIcons name="wechat" size={24} color="black" />

                    }} />
                    <Tab.Screen name="Matches" component={AccountScreen} options={{
                        tabBarIcon: () => <MaterialCommunityIcons name="heart-outline" size={24} color="black" />
                    }} />
                    <Tab.Screen name="Activity" component={AccountScreen} options={{
                        tabBarIcon: () => <Octicons name="feed-rocket" size={24} color="black" />
                    }} />
                    <Tab.Screen name="Feed" component={AccountScreen} options={{
                        tabBarIcon: () => <MaterialIcons name="notifications-none" size={24} color="black" />
                    }} />
                </Tab.Navigator>
            </QueryClientProvider>
        </NavigationContainer>
    );
}