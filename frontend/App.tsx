import React from "react";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CollectionScreen from "./components/pages/CollectionScreen";
import Header from "./components/header/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Platform } from "react-native";
import { CollectionsContextProvider } from "./context/CollectionsContext";
import LandingPage from "./components/pages/LandingPage";

export type RootStackParams = {
  Landing: undefined;
  Collections: undefined;
  Collection: { collectionId: string };
  Artwork: { collectionId: string; artworkId: string; source: string };
  SearchResults: { query: string };
};

const Stack = createStackNavigator<RootStackParams>();
const queryClient = new QueryClient();

export default function App() {
  const user = "royal-user";

  return (
    <QueryClientProvider client={queryClient}>
      <CollectionsContextProvider userId={user}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={({ route }) => ({
              header: () => {
                return route.name !== "Landing" ? <Header /> : null;
              },
            })}
          >
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="Collections" component={CollectionScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        {Platform.OS === "web" && <ReactQueryDevtools initialIsOpen={false} />}
      </CollectionsContextProvider>
    </QueryClientProvider>
  );
}
