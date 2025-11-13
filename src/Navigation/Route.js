import React, { Component } from "react";
import {
  TouchableOpacity,
  StatusBar,
  View,
  Share,
  Image,
  Dimensions,
  Text,
  SafeAreaView
} from "react-native";
const { height, width } = Dimensions.get('window');
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
import {isReadyRef, navigationRef} from "./RootNavigation";
import Login from "../Entry/Login";
import SignUp from '../Screens/SignUp/Index'
import SignUpSetPass from '../Screens/SignUp/SignUpSetPass'
import SignUpEnterCode from '../Screens/SignUp/SignUpEnterCode'
import SignUpEnterDetail from '../Screens/SignUp/SignUpEnterDetail'
import SignUpUploadPic from '../Screens/SignUp/SignUpUploadPic'
import SignUpCurrentJob from '../Screens/SignUp/SignUpCurrentJob'
import SignUpMyFiles from '../Screens/SignUp/SignUpMyFiles'

import SignUpIdealJob from '../Screens/SignUp/SignUpIdealJob'
import SignUpStep1 from "../Entry/SignUpStep1";
import SignUpStep2 from "../Entry/SignUpStep2";
import { connect } from "react-redux";
import { DrawerContent } from "./DrawerContent";
import SignUpStep3 from "../Entry/SignUpStep3";
import Home from "../Entry/Home";
import Feedback from "../Entry/Feedback";
import About from "../Entry/About";
import Contact from "../Entry/Contact";
import Profile from "../Entry/Profile";
import Job from "../Entry/Job";
import ProfileDetail from "../Entry/ProfileDetail";
import EditProfileDetail from "../Entry/EditProfileDetail";
import EmergencyContact from "../Entry/EmergencyContact";
import EditEmergencyContact from "../Entry/EditEmergencyContact";
import MyCompliance from "../Entry/MyCompliance";
import EligibilityToWork from "../Entry/EligibilityToWork";
import AddCompliance from "../Entry/AddCompliance";
import MyFile from "../Entry/MyFile";
import AddFile from "../Entry/AddFile";
import Setting from "../Entry/Setting";
import ChangePassword from "../Entry/ChangePassword";
import Timesheet from "../Entry/Timesheet";
import TimesheetDetail from "../Entry/TimesheetDetail";
import AddTimesheet1 from "../Entry/AddTimesheet1";
import AddTimesheet2 from "../Entry/AddTimesheet2";
import TimesheetPreview from "../Entry/TimesheetPreview";
import SubmitTimesheet from "../Entry/SubmitTimesheet";
import PaySlip from "../Screens/PayScale/PaySlip";
import ShiftAvailability from "../Screens/Availability/ShiftAvailability";
import EditShiftPreferences from "../Screens/Availability/EditShiftPreferences";
import ShiftPreferences from "../Screens/Availability/ShiftPreferences";
import Auth from "../Screens/Auth";
import MyJobs from "../Screens/Jobs/MyJobs";
import JobDetail from "../Screens/Jobs/JobDetail";
import WHSInfoDetail from "../Screens/Jobs/WHSInfoDetail";
import EditShiftAvailability from "../Screens/Availability/EditShiftAvailability";
import Availability from "../Screens/Availability/Availability";
import Types from "../redux/Types";
import SavedTimeSheet from "../Entry/SavedTimeSheet";
import Support from "../Entry/Support";
import SelectData from "../Screens/SelectData";
import Signature from "../Entry/Signature";
import SplashScreen from 'react-native-splash-screen'
import MyComplianceDetails from "../Entry/MyComplianceDetails";
import PdfView from "../Components/PdfView";
import JobMap from "../Screens/Jobs/JobMap";
import Messages from "../Entry/Messages";
import ClockOutScreen from "../Entry/ClockOutScreen";
import JobShifts from "../Entry/JobShifts";
import Chat from "../Entry/Chat";
import ChatList from "../Entry/ChatList";
import Welcome from "../Entry/Welcome";
import SelectEmployer from "../Entry/SelectEmployer";
import ForgotPassword from "../Entry/ForgotPassword";
import { Roaster } from "../Screens";
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { normalizeSize } from "../Util/CommonFun";
import ShiftTasks from "../Entry/ShiftTasks";
import { store } from "../redux/Store";
import AddLeave from "../Screens/Availability/AddLeave";

let LoginData = ''
const Stack = createStackNavigator();


const headerStyles = {
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
  backgroundColor: '#FFF',
}
const headerStylesBG = {
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
  backgroundColor: '#FFF',
}

const HomeStackScreen = (props) => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={Home}
      options={{
        header:()=>showDrawerWithBack(props)
        // headerTitleAlign: 'center',
        // headerTintColor: '#fff',
        // headerStyle: headerStyles,
        // headerLeft: () => (showDrawerIcon(props)),
        // headerRight: null,
        // headerTitle: () => (HeaderLogo())

      }}
    />
    <Stack.Screen
      name="JobShifts"
      component={JobShifts}
      options={{
        header:()=>showDrawerWithBack(props,true,"Today's Shift(s)")
        // headerTitleAlign: 'center',
        // headerTintColor: '#fff',
        // headerStyle: headerStyles,
        // headerLeft: () => (showDrawerIcon(props)),
        // headerTitle: () => (HeaderLogo())

      }}
    />
    <Stack.Screen
      name="JobDetail"
      component={JobDetail}
      options={{
        header:()=>showDrawerWithBack(props,true,'Clock In'),
        // headerTitleAlign: 'center',
        // headerTitleStyle: { fontSize: 18 },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (headerBackground()),
        // title: "Clock In",
        // headerBackImage:()=><Feather color={'#111'} size={27} name="chevron-left" />
      }}

    />


   <Stack.Screen
      name="WHSInfoDetail"
      component={WHSInfoDetail}
      options={{
        header:()=>showDrawerWithBack(props,true,'WHS Info'),
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: { fontSize: 18 },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (headerBackground()),
        // title: "WHS Info"
      }}

    />

   <Stack.Screen
      name="ShiftTasks"
      component={ShiftTasks}
      options={{
        header:()=>showDrawerWithBack(props,true,'Shift Tasks'),
      }}
    />



    <Stack.Screen
      name="JobMap"
      component={JobMap}
      options={{
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 18 },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerBackground: () => (headerBackground()),
        title: "Job Location"
      }}

    />

    <Stack.Screen
      name="ClockOutScreen"
      component={ClockOutScreen}
      options={{
        header:()=>showDrawerWithBack(props,false,"Clocked In")
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: { fontSize: 18 },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (headerBackground()),
        // headerBackImage:()=><Feather color={'#111'} size={27} name="chevron-left" />,
        // title: "Clocked In"
      }}
    />
    <Stack.Screen
      name="MyFile"
      component={MyFile}
      options={{
        header:()=>showDrawerWithBack(props,true,'My Files'),
      }}
    />
    <Stack.Screen
      name="AddFile"
      component={AddFile}
      options={{
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerBackground: () => (
          headerBackground()
        ),
        //headerLeft: () => (showBackIcon(props)),
        headerRight: () => (showHeaderAddIcon(props, 'AddCompliance')),
        title: "Add File"

      }}
    />
  </Stack.Navigator>
);

const FeedbackStack = createStackNavigator();
const FeedbackStackScreen = (props) => (
  <FeedbackStack.Navigator>
    <FeedbackStack.Screen
      name="Feedback"
      component={Feedback}
      options={{
        headerStyle: headerStylesBG,
        headerBackground: () => (
          headerBackground()
        ),
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: '#000',
        headerLeft: () => (showDrawerIcon(props)),
        headerRight: null,
        title: "Feedback"

      }}
    />
  </FeedbackStack.Navigator>
);

const AboutStack = createStackNavigator();
const AboutStackScreen = (props) => (
  <AboutStack.Navigator>
    <AboutStack.Screen
      name="About"
      component={About}
      options={{
        headerStyle: headerStylesBG,
        headerBackground: () => (
          headerBackground()
        ),
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: '#000',
        headerLeft: () => (showDrawerIcon(props)),
        headerRight: null,
        title: "About Us"

      }}
    />
  </AboutStack.Navigator>
);

const SupportStackScreen = (props) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Support"
      component={Support}
      options={{
        headerStyle: headerStylesBG,
        headerBackground: () => (
          headerBackground()
        ),
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: '#000',
        headerLeft: () => (showDrawerIcon(props)),
        headerRight: null,
        title: "Support"

      }}
    />
  </Stack.Navigator>
);

const ContactStack = createStackNavigator();
const ContactStackScreen = (props) => (
  <ContactStack.Navigator>
    <ContactStack.Screen
      name="Contact"
      component={Contact}
      options={{
        headerStyle: headerStylesBG,
        headerBackground: () => (
          headerBackground()
        ),
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: '#000',
        headerLeft: () => (showDrawerIcon(props)),
        headerRight: null,
        title: "Contact Us"

      }}
    />
  </ContactStack.Navigator>
);
const RoasterStack = createStackNavigator();
const RoasterStackScreen = (props) => (
  <RoasterStack.Navigator initialRouteName="Roster">
    <RoasterStack.Screen
      name="Roster"
      component={Roaster}
      options={{
        // headerStyle: headerStylesBG,
        // headerBackground: () => (
        //   headerBackground()
        // ),
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerTintColor: '#000',
        // headerLeft: () => (showDrawerIcon(props)),
        // headerRight: null,
        header:()=>showDrawerWithBack(props,true,'Roster'),

      }}
    />
  </RoasterStack.Navigator>
);

const ProfileStack = createStackNavigator();
const ProfileStackScreen = (props) => (
  <ProfileStack.Navigator initialRouteName="Profile">
    <ProfileStack.Screen
      name="Profile"
      component={Profile}
      options={{
        header:()=>showDrawerWithBack(props,true,'My Profile'),
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerTintColor: '#000',
        // headerLeft: () => (showDrawerIcon(props)),
        // headerRight: null,
        // title: "My Profile"

      }}
    />
    <ProfileStack.Screen
      name="ProfileDetail"
      component={ProfileDetail}
      options={{
        header:()=>showDrawerWithBack(props,true,'My Details'),

        // headerBackTitleVisible: false,
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerTintColor: '#000',
        // //headerLeft: () => (showBackIcon(props)),
        // headerRight: null,
        // title: "My Details"

      }}
    />
    <ProfileStack.Screen
      name="EditProfileDetail"
      component={EditProfileDetail}
      options={{
         header:()=>showDrawerWithBack(props,true,'Edit My Details'),
        // headerStyle: headerStyles,
        // headerBackTitleVisible: false,
        // headerBackground: () => (
        //   headerBackground()
        // ),
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerTintColor: '#000',
        // //headerLeft: () => (showBackIcon(props)),
        // headerRight: () => (showHeaderCheckIcon(props)),
        // title: "Edit My Details",
        // headerShown:false

      }}
    />
    <ProfileStack.Screen
      name="EmergencyContact"
      component={EmergencyContact}
      options={{
        header:()=>showDrawerWithBack(props,true,'Emergency Contacts'),

        // headerStyle: headerStyles,
        // headerBackTitleVisible: false,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerTintColor: '#000',
        //headerLeft: () => (showBackIcon(props)),
        // headerRight: () => (showHeaderEditIcon(props, 'EditEmergencyContact')),
        // title: "Emergency Contacts"

      }}
    />
    <ProfileStack.Screen
      name="EditEmergencyContact"
      component={EditEmergencyContact}
      options={{
         header:()=>showDrawerWithBack(props,true,'Edit Emergency Contact'),
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (
        //   headerBackground()
        // ),
        // //headerLeft: () => (showBackIcon(props)),
        // headerRight: () => (showHeaderCheckIcon(props)),
        // title: "Edit Emergency Contacts",
        // headerShown:false

      }}
    />
    <ProfileStack.Screen
      name="MyCompliance"
      component={MyCompliance}
      options={{
        header:()=>showDrawerWithBack(props,true,'My Compliances'),

        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (
        //   headerBackground()
        // ),
        //headerLeft: () => (showBackIcon(props)),
        // headerRight: () => (showHeaderAddIcon(props, 'AddCompliance')),
        title: "My Compliances"

      }}
    />
    <ProfileStack.Screen
      name="MyComplianceDetails"
      component={MyComplianceDetails}
      options={{
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: { fontSize: 18, },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (headerBackground()),
        // title: "My Compliance Details",
        header:()=>showDrawerWithBack(props,true,'Compliance Detail'),



      }}
    />
    <ProfileStack.Screen
      name="PdfView"
      component={PdfView}
      options={{
        header:()=>showDrawerWithBack(props,true,'Compliance Detail'),
      }}
    />
    <ProfileStack.Screen
      name="AddCompliance"
      component={AddCompliance}
      options={{
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        // headerBackground: () => (
        //   headerBackground()
        // ),
        //headerLeft: () => (showBackIcon(props)),
        headerRight: () => (showHeaderCheckIcon(props)),
        title: "Add Compliances"

      }}
    />
    <ProfileStack.Screen
      name="EligibilityToWork"
      component={EligibilityToWork}
      options={{
        header:()=>showDrawerWithBack(props,true,'Eligibility To Work'),

      }}
    />
    <ProfileStack.Screen
      name="MyFile"
      component={MyFile}
      options={{
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (
        //   headerBackground()
        // ),
        //headerLeft: () => (showBackIcon(props)),
        // headerRight: () => (showHeaderAddIcon(props, 'AddFile')),
        // title: "My Files"
        header:()=>showDrawerWithBack(props,true,'My Files'),


      }}
    />
    <ProfileStack.Screen
      name="AddFile"
      component={AddFile}
      options={{
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (
        //   headerBackground()
        // ),
        // //headerLeft: () => (showBackIcon(props)),
        // headerRight: () => (showHeaderAddIcon(props, 'AddCompliance')),
        // title: "Add File"
        //  headerRight: () => (showHeaderCheckIcon(props)),
      }}
    />
    <ProfileStack.Screen
      name="Setting"
      component={Setting}
      options={{
        // headerShown:false,
        header:()=>showDrawerWithBack(props,false,'Settings'),

        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (
        //   headerBackground()
        // ),
        // //headerLeft: () => (showBackIcon(props)),
        // headerRight: null,
        // title: "Settings"

      }}
    />
    <ProfileStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{
        header:()=>showDrawerWithBack(props,false,'Change Password'),
        // headerBackTitleVisible: false,
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 18,
        // },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (
        //   headerBackground()
        // ),
        // //headerLeft: () => (showBackIcon(props)),
        // headerRight: () => (showHeaderCheckIcon(props)),
        // title: "Change Password",
        // headerShown:false

      }}
    />

    <ProfileStack.Screen
      name="SelectData"
      component={SelectData}
      options={{
        headerShown: false,
      }}
    />

  </ProfileStack.Navigator>
);


const TimesheetStack = createStackNavigator();
const TimesheetStackScreen = (props) => (
  <TimesheetStack.Navigator initialRouteName="Timesheet">
    <TimesheetStack.Screen
      name="Timesheet"
      component={Timesheet}
      options={{
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerLeft: () => (showDrawerIcon(props)),
        title: "My Timesheets"

      }}
    />
    <TimesheetStack.Screen
      name="TimesheetDetail"
      component={TimesheetDetail}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerRight: () => (showHeaderAddIcon(props, 'AddTimesheet1')),
        title: "Timesheet Details"

      }}
    />
    <TimesheetStack.Screen
      name="AddTimesheet1"
      component={AddTimesheet1}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        title: "Add Timesheet"

      }}
    />
    <TimesheetStack.Screen
      name="AddTimesheet2"
      component={AddTimesheet2}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        title: "Add Timesheet"

      }}
    />
    <TimesheetStack.Screen
      name="SavedTimeSheet"
      component={SavedTimeSheet}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 18, },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        title: "Show Timesheet"
      }}
    />
    <TimesheetStack.Screen
      name="TimesheetPreview"
      component={TimesheetPreview}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        // headerRight: () => (showHeaderCheckIcon(props)),

        title: "Timesheet Preview"

      }}
    />
    <TimesheetStack.Screen
      name="SubmitTimesheet"
      component={SubmitTimesheet}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        title: "Submit Timesheet"

      }}
    />
    <TimesheetStack.Screen
      name="Signature"
      component={Signature}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        title: "Signature"

      }}
    />


  </TimesheetStack.Navigator>
);


const JobStack = createStackNavigator();
const JobStackScreen = (props) => (
  <JobStack.Navigator>
    <JobStack.Screen
      name="Job"
      component={Job}
      options={{
        headerStyle: headerStylesBG,
        headerBackground: () => (
          headerBackground()
        ),
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: '#000',
        headerLeft: () => (showDrawerIcon(props)),
        headerRight: null,
        title: "Jobs"

      }}
    />
    <JobStack.Screen
      name="MyJobs"
      component={MyJobs}
      options={{
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 18 },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerBackground: () => (headerBackground()),
        headerLeft: () => (showDrawerIcon(props)),
        title: "My Jobs"

      }}
    />
    <JobStack.Screen
      name="JobShifts"
      component={JobShifts}
      options={{
        header:()=>showDrawerWithBack(props,true,"Today's Shift(s)")
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: { fontSize: 18 },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (headerBackground()),
        // headerLeft: () => (showDrawerIcon(props)),
        // title: "My Shifts"

      }}
    />
    <JobStack.Screen
      name="JobDetail"
      component={JobDetail}
      options={{
        header:()=>showDrawerWithBack(props,true,'Clock In'),
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: { fontSize: 18 },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (headerBackground()),
        // title: "Job Detail"
      }}

    />


   <JobStack.Screen
      name="WHSInfoDetail"
      component={WHSInfoDetail}
      options={{
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 18 },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerBackground: () => (headerBackground()),
        title: "WHS Info"
      }}

    />
    <JobStack.Screen
      name="ShiftTasks"
      component={ShiftTasks}
      options={{
        header:()=>showDrawerWithBack(props,true,'Shift Tasks'),
      }}
    />

    <JobStack.Screen
      name="JobMap"
      component={JobMap}
      options={{
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 18 },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerBackground: () => (headerBackground()),
        title: "Job Location"
      }}

    />

    <JobStack.Screen
      name="ClockOutScreen"
      component={ClockOutScreen}
      options={{
        header:()=>showDrawerWithBack(props,false,"Clocked In"),
        // headerStyle: headerStyles,
        // headerTitleAlign: 'center',
        // headerTitleStyle: { fontSize: 18 },
        // headerBackTitleVisible: false,
        // headerTintColor: '#000',
        // headerBackground: () => (headerBackground()),
        // headerBackImage:()=><Feather color={'#111'} size={27} name="chevron-left" />,
        // title: "Clocked In"
      }}

    />
  </JobStack.Navigator>
);

const PaySlipStack = createStackNavigator();
const PaySlipStackScreen = (props) => (
  <PaySlipStack.Navigator>
    <PaySlipStack.Screen
      name="PaySlip"
      component={PaySlip}
      options={{
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerBackground: () => (headerBackground()),
        headerLeft: () => (showDrawerIcon(props)),
        // headerRight: () => (showHeaderAddIcon(props, 'AddFile')),
        title: "My Payslips"

      }}
    />
  </PaySlipStack.Navigator>
);



const AvailabilityStackScreen = (props) => (
  <Stack.Navigator initialRouteName="Availability">
    <Stack.Screen
      name="Availability"
      component={Availability}
      options={{
        header:()=>showDrawerWithBack(props,true,'My Leave & Availability'),

        // headerStyle: headerStyles,
        // headerBackTitleVisible: false,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: height / 40,
        // },
        // headerTintColor: '#000',
        // headerLeft: () => (showDrawerIcon(props)),
        // title: "My Availability"

      }}


    />
    <Stack.Screen
      name="ShiftPreferences"
      component={ShiftPreferences}
      options={{
        header:()=>showDrawerWithBack(props,true,'Shift Preferences'),

        // headerStyle: headerStyles,
        // headerBackTitleVisible: false,
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: height / 40,
        // },
        // headerTintColor: '#000',
        // // headerLeft: () => (showBackIcon1(props,'Home')),
        // // headerRight: () => (showHeaderEditIcon(props, 'EditShiftPreferences')),
        // title: "Shift Preferences"

      }}


    />
    <Stack.Screen
      name="EditShiftPreferences"
      component={EditShiftPreferences}
      options={{
        headerStyle: headerStyles,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: height / 40,
        },
        headerTintColor: '#000',
        // headerLeft: () => (showBackIcon1(props,'ShiftPreferences')),
        headerRight: () => (showHeaderCheckIcon(props)),
        title: "Edit Shift Preferences"

      }}

    />
    <Stack.Screen
      name="ShiftAvailability"
      component={ShiftAvailability}
      options={{
        headerStyle: headerStyles,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: height / 40,
        },
        headerTintColor: '#000',
        // headerLeft: () => (showBackIcon1(props,'ShiftPreferences')),
        headerRight: () => (showHeaderEditIcon(props, 'EditShiftPreferences')),
        title: "Shift Availability"

      }} />

    <Stack.Screen
      name="EditShiftAvailability"
      component={EditShiftAvailability}
      options={{
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerBackground: () => (
          headerBackground()
        ),
        headerRight: () => (showHeaderEditIcon(props, 'EditShiftPreferences')),

        title: "Edit Shift Availability"
      }}

    />
    <Stack.Screen
      name="AddLeave"
      component={AddLeave}
      options={{
        header:()=>showDrawerWithBack(props,true,'Leave Request'),
      }}
    />
  </Stack.Navigator>
);



const MessagesStackScreen = (props) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Messages"
      component={Messages}
      options={{
        // headerStyle: headerStyles,
        // headerBackTitleVisible: false,
        // headerTitleAlign: 'center',
        // headerTitleStyle: { fontSize: height / 40 },
        // headerTintColor: '#000',
        // headerBackground: () => (headerBackground()),
        // headerLeft: () => (showDrawerIcon(props)),
        // title: "Messages"
        header:()=>showDrawerWithBack(props,true,'Messages'),
      }}

    />
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={{
        // headerStyle: headerStyles,
        // headerBackTitleVisible: false,
        // headerTitleAlign: 'center',
        // headerTitleStyle: { fontSize: height / 40 },
        // headerTintColor: '#000',
        // headerBackground: () => (headerBackground()),
        // title: "Send Message"
        header:()=>showDrawerWithBack(props,true,'New Conversation'),
      }}

    />
    <Stack.Screen
      name="ChatList"
      component={ChatList}
      options={{
        // headerStyle: headerStyles,
        // headerBackTitleVisible: false,
        // headerTitleAlign: 'center',
        // headerTitleStyle: { fontSize: height / 40 },
        // headerTintColor: '#000',
        // headerBackground: () => (headerBackground()),
        // title: "Send Message"
        header:()=>showDrawerWithBack(props,true,'Conversation'),
      }}

    />
    <Stack.Screen
      name="JobMap"
      component={JobMap}
      options={{
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 18 },
        headerBackTitleVisible: false,
        headerTintColor: '#000',
        headerBackground: () => (headerBackground()),
        title: "Job Location"
      }}

    />
  </Stack.Navigator>
);


const HeaderLogo = () => {
  return (
    <Image
      style={{ width: 350, height: 45 }}
      resizeMode={'contain'}
      source={require('../Assets/Icons/WorkFoceWhiteSmallLogo.png')} />

  )
}

const showHeaderAddIcon = (props, navigateUrl) => {
  return (
    <TouchableOpacity activeOpacity={1} underlayColor="white"
      onPress={() => props.navigation.navigate(navigateUrl)}
      style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
      <Image
        style={{ width: 18, height: 18, alignSelf: 'center' }}
        resizeMode={'contain'}
        source={require('../Assets/Icons/HeaderAdd.png')} />
    </TouchableOpacity>
  );
}

const headerBackground = () => {
  return null
  // return (
  //   <Image
  //     style={{ backgroundColor: 'transparent', position: 'absolute', top: -100, left: -100, alignSelf: 'flex-start', marginLeft: 0, justifyContent: "flex-start", alignItems: "flex-start", alignContent: "flex-start" }}
  //     resizeMode={'contain'}
  //     source={require('../Assets/Icons/BackScreen.png')} />
  // )
}



const showHeaderCheckIcon = (props) => {
  return (
    <TouchableOpacity activeOpacity={1} underlayColor="white"
      //onPress={() => props.navigation.goBack()}
      style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 10 }}>
      <Image
        style={{ width: 22, height: 18, alignSelf: 'center' }}
        resizeMode={'contain'}
        source={require('../Assets/Icons/HeaderCheck.png')} />
    </TouchableOpacity>
  );
}

const showHeaderEditIcon = (props, navigateUrl) => {
  return (
    <TouchableOpacity activeOpacity={1} underlayColor="white"
      onPress={() => props.navigation.navigate(navigateUrl)}
      style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 10 }}>
      <Image
        style={{ width: 22, height: 18, alignSelf: 'center' }}
        resizeMode={'contain'}
        source={require('../Assets/Icons/HeaderEdit.png')} />
    </TouchableOpacity>
  );
}

const showDrawerIcon = (props) => {
  return <EvilIcons 
    name="navicon" 
    color={"#111"}
    style={{paddingLeft: 10, paddingRight: 0 }}
    onPress={() => props.navigation.openDrawer()}
    size={26}/>
  return (
    <TouchableOpacity activeOpacity={1} underlayColor="white"
      onPress={() => props.navigation.openDrawer()}
      style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
      <Image
        style={{ width: 18, height: 14, alignSelf: 'center' }}
        resizeMode={'contain'}
        source={require('../Assets/Icons/sidebar.png')} />
    </TouchableOpacity>
  );
}


const showDrawerWithBack = (props,isHeaderTitle=false,title="")=>{
  const backBtnPress = ()=>{
    const totalRoutesInStack = props?.route?.state?.routes;
    if(Array.isArray(totalRoutesInStack) && totalRoutesInStack.length >1){
      props?.navigation?.dispatch(StackActions.pop(1))
    }else if(props?.navigation?.canGoBack()){
      props?.navigation?.goBack()
    }
  }
  const facilityName = store.getState().loginStatus.facility
  return(
 <SafeAreaView style={{backgroundColor:"#ffffff"}}>
   <View>
  <View style={{flexDirection:"row",alignItems:"center",backgroundColor:"#fff"}}>
    {showDrawerIcon(props)}
    {HeaderLogo()}
    <View/>
  </View>
  <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:10,justifyContent:"center",paddingVertical:10,backgroundColor:'#1c78ba'}}>
    <Text style={{ fontSize:normalizeSize(15) ,textAlign:"center",color:"#fff"}}>{facilityName}</Text>
  <View/>
  </View>
  {isHeaderTitle?<View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:10,justifyContent:"space-between",paddingVertical:4,backgroundColor:'#d9d9d9'}}>
      <TouchableOpacity onPress={()=>backBtnPress()}>
          <Feather color={'#111'} size={32} name="chevron-left" />
      </TouchableOpacity>
      <Text style={{ fontSize:normalizeSize(18) ,textAlign:"center"}}>{title}</Text>
      <View/>
  </View>:null}
  </View>
 </SafeAreaView>
  )
}

const Drawer = createDrawerNavigator();
const DrawerScreen = () => (
  <Drawer.Navigator drawerStyle={{ width: width / 1.6, }} initialRouteName="Home" drawerContent={props => <DrawerContent {...props} />}>
    <Drawer.Screen options={{ swipeEnabled: false, unmountOnBlur: true }} name="Home" component={HomeStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="Feedback" component={FeedbackStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="About" component={AboutStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="Contact" component={ContactStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="Roster" component={RoasterStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="Profile" component={ProfileStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="Availability" component={AvailabilityStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="Job" component={JobStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="Messages" component={MessagesStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="PaySlip" component={PaySlipStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="Support" component={SupportStackScreen} />
    <Drawer.Screen options={{ swipeEnabled: false }} name="Timesheet" component={TimesheetStackScreen} />
  </Drawer.Navigator>
);

const AuthStack = createStackNavigator();
const AuthStackScreen = (props) => (
  <AuthStack.Navigator initialRouteName="Welcome" options={{ headerShown: false }}>
    <AuthStack.Screen
      name="Welcome"
      component={Welcome}
      {...props}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Login"
      component={Login}
      {...props}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      {...props}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUp}
      {...props}
      options={{ headerShown: false }}
    />

   <AuthStack.Screen
      name="SignUpSetPass"
      component={SignUpSetPass}
      {...props}
      options={{ headerShown: false }}
    />

   <AuthStack.Screen
      name="SignUpEnterCode"
      component={SignUpEnterCode}
      {...props}
      options={{ headerShown: false }}
    />


   <AuthStack.Screen
      name="SignUpEnterDetail"
      component={SignUpEnterDetail}
      {...props}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: '#000',
        //headerLeft: () => (showBackIcon(props)),
        headerRight: null,
        title: "Welcome"
      }}
    />

 <AuthStack.Screen
      name="SignUpUploadPic"
      component={SignUpUploadPic}
      {...props}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: '#000',
        //headerLeft: () => (showBackIcon(props)),
        headerRight: null,
        title: "Your Profile"
      }}
    />

   <AuthStack.Screen
      name="SignUpCurrentJob"
      component={SignUpCurrentJob}
      {...props}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: '#000',
        //headerLeft: () => (showBackIcon(props)),
        headerRight: null,
        title: "Current Job"
      }}
    />

  <AuthStack.Screen
      name="SignUpMyFiles"
      component={SignUpMyFiles}
      {...props}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: '#000',
        //headerLeft: () => (showBackIcon(props)),
        headerRight: null,
        title: "Resume & Availability"
      }}
    />


    <AuthStack.Screen
      name="SignUpIdealJob"
      component={SignUpIdealJob}
      {...props}
      options={{
        headerBackTitleVisible: false,
        headerStyle: headerStyles,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
        },
        headerTintColor: '#000',
        //headerLeft: () => (showBackIcon(props)),
        headerRight: null,
        title: "Ideal Job"
      }}
    />


    <AuthStack.Screen
      name="SignUpStep1"
      component={SignUpStep1}
      {...props}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="SignUpStep2"
      component={SignUpStep2}
      {...props}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="SignUpStep3"
      component={SignUpStep3}
      {...props}
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
)

const AppStack = createStackNavigator();
const AppStackScreen = (props) => (
  <AppStack.Navigator headerMode="none" initialRouteName="Home">
    <AppStack.Screen
      name="Home"
      component={DrawerScreen}
      {...props}
      options={{
        animationEnabled: false
      }}
    />
    <AppStack.Screen
      name="SelectEmployer"
      component={SelectEmployer}
      {...props}
      options={{
        animationEnabled: false
      }}
    />
  </AppStack.Navigator>

)
const AppStackScreen_2 = (props) => (
  <AppStack.Navigator>
    <AppStack.Screen
      name="ChatList_2"
      component={ChatList}
      {...props}
      options={{
        animationEnabled: false,
        headerStyle: headerStyles,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: height / 40 },
        headerTintColor: '#000',
        headerBackground: () => (headerBackground()),
        title: "Send Message"
      }}
    />
  </AppStack.Navigator>

)
class RootStack extends Component {
  // const dispatch = useDispatch()
  constructor(props) {
    super(props);
    this.state = {


    }
  }
  componentWillUnmount() {
    isReadyRef.current = false;
  }


  render() {
    return (
      <>
        <NavigationContainer ref={navigationRef} onReady={() => {
          isReadyRef.current = true;
        }}>
          <Stack.Navigator>
            <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
            <Stack.Screen name="AuthStackScreen" component={AuthStackScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={AppStackScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AppStackScreen_2" component={AppStackScreen_2} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    )
  }
}




const mapStateToProps = (state) => {
  const { HomeDetails: { ClockPopup, ClockPopUpData },
    loginStatus: { loginData }, SettingDetails: { LocationStatus } } = state;

  return { LocationStatus, ClockPopup, loginData, ClockPopUpData, };
};

const mapDispatchToProps = dispatch => {
  return {

    DispatchUser: data => dispatch({ type: Types.GET_DETAILS, data: data }),
    DispatchLocationFlag: data => dispatch({ type: Types.LOCATION_FLAG, data: data }),

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RootStack);

































