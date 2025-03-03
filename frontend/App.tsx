import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CollectionScreen from "./components/pages/CollectionScreen";
import Header from "./components/header/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Platform } from "react-native";
import { CollectionsContextProvider } from "./context/CollectionsContext";

export type RootStackParams = {
  Collections: undefined;
};

const Stack = createStackNavigator<RootStackParams>();
const queryClient = new QueryClient();

export default function App() {
  const user = "royal-user";
  console.log("App is loading");

  return (
    <QueryClientProvider client={queryClient}>
      <CollectionsContextProvider userId={user}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Collections"
            screenOptions={() => ({
              header: () => {
                return <Header />;
              },
            })}
          >
            <Stack.Screen name="Collections" component={CollectionScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        {Platform.OS === "web" && <ReactQueryDevtools initialIsOpen={false} />}
      </CollectionsContextProvider>
    </QueryClientProvider>
  );
}
