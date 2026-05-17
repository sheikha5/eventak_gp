import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';


import LoginScreen from './LoginScreen'; 
import RegisterScreen from './RegisterScreen'; 
import MainScreen from './Mainscreen'; 
import ExploreScreen from './Explore'; 
import ProfileScreen from './Profile'; 


import AdminDashboard from './AdminDashboard/AdminDashboard';
import ManageEvents from './ManageEvents/ManageEvents'; 
import ManageUsers from './ManageUsers/ManageUsers';
import ReviewTickets from './ReviewTickets/ReviewTickets';


import BookingScreen from './Booking'; 
import ListingScreen from './Listingscreen'; 
import VerificationScreen from './Verification'; 
import ChatRoomScreen from './ChatRoom'; 
import PaymentScreen from './PaymentScreen'; 


import CardPayment from './Payment/CardPayment'; 
import Installments from './Payment/Installments';
import MyTicketsList from './MyTicketsList'; 
import MyTicketDetail from './MyTickets';    
import GiftScreen from './Giftscreen'; 


import SupportScreen from './Support'; 
import SettingsScreen from './Settings'; 

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <StripeProvider 
      publishableKey="pk_test_51TLJPyFk8UWYyKQwrzXWzEzuNdd9uxs1yWpxki9Z0tjRndycSY6yZvahN1vJR8znxLuP6MNE40ThjQyMEatVYDmS00cWwqkNNB"
      merchantIdentifier="merchant.com.eventak" 
    >
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#1A0831" />
        
        <Stack.Navigator 
          initialRouteName="Login" 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right' 
          }}
        >
          
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Explore" component={ExploreScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          
          
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="ManageEvents" component={ManageEvents} />
          <Stack.Screen name="ManageUsers" component={ManageUsers} />
          <Stack.Screen name="ReviewTickets" component={ReviewTickets} />

          
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="Listing" component={ListingScreen} /> 
          <Stack.Screen name="Verification" component={VerificationScreen} /> 
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          
          
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="CardPayment" component={CardPayment} />
          <Stack.Screen name="Installments" component={Installments} />

          
          <Stack.Screen name="MyTicketsList" component={MyTicketsList} /> 
          <Stack.Screen name="MyTicketDetail" component={MyTicketDetail} /> 
          <Stack.Screen name="Gift" component={GiftScreen} />

          
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
};

export default App;