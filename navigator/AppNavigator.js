import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PixelRatio } from 'react-native';


// Screens
import StartPage from '../screens/Auth/StartPage';
import Login from '../screens/Auth/Login';
import Login_ID from '../screens/Auth/Login_ID';
import AddMembership from '../screens/Auth/AddMembership';
import AddMembershipFinish from '../screens/Auth/AddMembershipFinish';
import Home from '../screens/Main/Home';
import LoginWebview from '../screens/Auth/LoginWebview';
import IdFindScreen from '../screens/Auth/IdFindScreen';
import PasswordReSettingScreen from '../screens/Auth/PasswordReSettingScreen';
import PasswordChangeScreen from '../screens/Auth/PasswordChangeScreen';
import PhoneAuthConfirmScreen from '../screens/Auth/PhoneAuthConfirmScreen';
import PaymentScreen from '../screens/Main/PaymentScreen';
import PaymentCompletScreen from '../screens/Main/PaymentCompletScreen';
import ConsultingReservationHistory from '../screens/Main/ConsultingReservationHistory';
import ConsultingReservationDetail from '../screens/Main/ConsultingReservationDetail';
import ReservationListScreen from '../screens/Main/ReservationListScreen.js';
import ReservationList from '../screens/Main/ReservationList.js';
import CounselorList from '../screens/Main/CounselorList';

import ReservationDetail from '../screens/Main/ReservationDetail';
// Redux
import { useSelector, useDispatch } from 'react-redux';


import Acquisition from '../screens/Main/Acquisition';
import CheckTerms from '../screens/Main/CheckTerms';
import GainsTax from '../screens/Main/GainsTax';
import ConsultingReservation from '../screens/Main/ConsultingReservation';
import ConsultingReservation2Screen from '../screens/Main/ConsultingReservation2Screen.js';
import ConsultingReservation2 from '../screens/Main/ConsultingReservation2.js';
import GainTaxRefund from '../screens/Main/GainTaxRefund';

import FixedHouse from '../screens/Main/FixedHouse';
import AddHouse from '../screens/Main/AddHouse';
import FixedHouseList from '../screens/Main/FixedHouseList';
import AddHouseList from '../screens/Main/AddHouseList';
import CertificationAcq from '../screens/Main/CertificationAcq';
import CertificationGains from '../screens/Main/CertificationGains';

import AcquisitionChat from '../screens/Main/AcquisitionChat';
import FamilyHouse from '../screens/Main/FamilyHouse';
import RegisterFamilyHouse from '../screens/Main/RegisterFamilyHouse';
import DoneResisterFamilyHouse from '../screens/Main/DoneResisterFamilyHouse';
import DirectRegister from '../screens/Main/DirectRegister';
import RegisterDirectHouse from '../screens/Main/RegisterDirectHouse';
import OwnedHouseDetail from '../screens/Main/OwnedHouseDetail';
import FixedHouseDetail from '../screens/Main/FixedHouseDetail';
import OwnedFamilyHouse from '../screens/Main/OwnedFamilyHouse';
import DoneSendFamilyHouse from '../screens/Main/DoneSendFamilyHouse';
import GainsTaxChat from '../screens/Main/GainsTaxChat';
import Privacy from '../screens/Main/Terms/Privacy';
import NetworkAlert from '../screens/Main/NetworkAlert';
import Information from '../screens/Main/Information';
import { SheetProvider, registerSheet } from 'react-native-actions-sheet';

// Action Sheets

import OwnHouseSheet from '../components/bottomSheets/OwnHouseSheet';
import OwnHouseSheet2 from '../components/bottomSheets/OwnHouseSheet2';
import StakeSheet from '../components/bottomSheets/StakeSheet.js';
import StakeSheetGains from '../components/bottomSheets/StakeSheetGains';
import GainSheet from '../components/bottomSheets/GainSheet';
import ExpenseSheet from '../components/bottomSheets/ExpenseSheet';
import ConsultingSheet from '../components/bottomSheets/ConsultingSheet';
import DeleteHouseAlert from '../components/bottomSheets/DeleteHouseAlert';
import AdBannerSheet from '../components/bottomSheets/AdBannerSheet';
import InfoReservationCancel from '../components/bottomSheets/InfoReservationCancel';
import InfoHandleWithDraw from '../components/bottomSheets/InfoHandleWithDraw';
import InfoAlert from '../components/bottomSheets/InfoAlert';
import InfoCertification from '../components/bottomSheets/InfoCertification';
import InfoFixHouseDelete from '../components/bottomSheets/InfoFixHouseDelete';
import InfoAddHouseDelete from '../components/bottomSheets/InfoAddHouseDelete';
import InfoConsulting from '../components/bottomSheets/InfoConsulting';
import InfoConsultingCancel from '../components/bottomSheets/InfoConsultingCancel';
import InfoRefundingCancel from '../components/bottomSheets/InfoRefundingCancel';
import InfoDeleteHouse from '../components/bottomSheets/InfoDeleteHouse';
import InfoOwnHouse from '../components/bottomSheets/InfoOwnHouse';
import InfoBuyPrice from '../components/bottomSheets/InfoBuyPrice';
import InfoBuyDate from '../components/bottomSheets/InfoBuyDate';
import InfoExpense from '../components/bottomSheets/InfoExpense';
import LogOutSheet from '../components/bottomSheets/LogOutSheet';
import MapViewListSheet from '../components/bottomSheets/MapViewListSheet';
import AcquisitionSheet from '../components/bottomSheets/AcquisitionSheet';
import CertSheet from '../components/bottomSheets/CertSheet';
import CertSheet_ori from '../components/bottomSheets/CertSheet_ori';
import CertSheet2 from '../components/bottomSheets/CertSheet2';
import JointSheet from '../components/bottomSheets/JointSheet';
import JointSheetGain from '../components/bottomSheets/JointSheetGain';
import OwnHouseCountSheet from '../components/bottomSheets/OwnHouseCountSheet';
import ReviewSheet from '../components/bottomSheets/ReviewSheet';
import directlivePeriod from '../components/bottomSheets/directlivePeriod';
import SearchHouseSheet from '../components/bottomSheets/SearchHouseSheet';
import ConfirmSheet2 from '../components/bottomSheets/ConfirmSheet2';
import ConfirmSheet from '../components/bottomSheets/ConfirmSheet';
//import Third from '../screens/Main/Terms/Third';
import Cert from '../screens/Main/Terms/Cert';
import Cert2 from '../screens/Main/Terms/Cert2';
import Cert3 from '../screens/Main/Terms/Cert3';
import InfoCert from '../screens/Main/Terms/InfoCert';
import Privacy2 from '../screens/Main/Terms/Privacy2';
import Privacy3 from '../screens/Main/Terms/Privacy3';
import OwnHousePrivacy from '../screens/Main/Terms/OwnHousePrivacy';
import CertificationPrivacy from '../screens/Main/Terms/CertificationPrivacy';
import InfoPrivacy from '../screens/Main/Terms/InfoPrivacy';
import Location2 from '../screens/Main/Terms/Location2';
import InfoLocation from '../screens/Main/Terms/InfoLocation';
import Copyright3 from '../screens/Main/Terms/Copyright3';
import Marketing2 from '../screens/Main/Terms/Marketing2';
import Gov24 from '../screens/Main/Terms/Gov24';
import HouseDetail from '../screens/Main/HouseDetail';
import SearchHouseSheet2 from '../components/bottomSheets/SearchHouseSheet2';
import MapViewListSheet2 from '../components/bottomSheets/MapViewListSheet2';
import QuestionMarkDefinition from '../components/bottomSheets/QuestionMarkDefinition';
import ChooseHouseTypeAlert from '../components/bottomSheets/ChooseHouseTypeAlert';
import ChooseHouseDongHoAlert from '../components/bottomSheets/ChooseHouseDongHoAlert';
import UpdateAddressAlert from '../components/bottomSheets/UpdateAddressAlert';
import UpdateHouseDetailNameAlert from '../components/bottomSheets/UpdateHouseDetailNameAlert';
import UpdateHouseNameAlert from '../components/bottomSheets/UpdateHouseNameAlert';
import UpdatePubLandPriceAlert from '../components/bottomSheets/UpdatePubLandPriceAlert';
import UpdateBuyPriceAlert from '../components/bottomSheets/UpdateBuyPriceAlert';
import UpdateAreaMeterAlert from '../components/bottomSheets/UpdateAreaMeterAlert';
import UpdateUserProportionAlert from '../components/bottomSheets/UpdateUserProportionAlert';
import UpdateBuyDateAlert from '../components/bottomSheets/UpdateBuyDateAlert';
import UpdateContractDateAlert from '../components/bottomSheets/UpdateContractDateAlert';
import UpdateConsultingDateAndTimeAlert from '../components/bottomSheets/UpdateConsultingDateAndTimeAlert';
import UpdateConsultingContentAlert from '../components/bottomSheets/UpdateConsultingContentAlert';
//import UpdateBalanceDateAlert from '../components/bottomSheets/UpdateBalanceDateAlert';
//import UpdateMoveInDateAlert from '../components/bottomSheets/UpdateMoveInDateAlert';
//import UpdateMoveOutDateAlert from '../components/bottomSheets/UpdateMoveOutDateAlert';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const fontSizeBase = 8;
  const currentUser = useSelector(state => state.currentUser?.value);
  const startLaunch = useSelector(state => state.startPage.value);
  const horizontalAnimation = {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  };



  useEffect(() => {
    registerSheet('mapViewList', MapViewListSheet);
    registerSheet('mapViewList2', MapViewListSheet2);
    registerSheet('searchHouse', SearchHouseSheet);
    registerSheet('searchHouse2', SearchHouseSheet2);
    registerSheet('acquisition', AcquisitionSheet);
    registerSheet('Stake', StakeSheet);
    registerSheet('StakeGains', StakeSheetGains);
    registerSheet('cert', CertSheet);
    registerSheet('cert_ori', CertSheet_ori);
    registerSheet('cert2', CertSheet2);
    registerSheet('AdBanner', AdBannerSheet);
    registerSheet('infoExpense', InfoExpense);
    registerSheet('info', InfoAlert);
    registerSheet('infoCertification', InfoCertification);
    registerSheet('InfoConsulting', InfoConsulting);
    registerSheet('InfoConsultingCancel', InfoConsultingCancel);
    registerSheet('InfoRefundingCancel', InfoRefundingCancel);
    registerSheet('InfoDeleteHouse', InfoDeleteHouse);
    registerSheet('InfoOwnHouse', InfoOwnHouse);
    registerSheet('InfoFixHouseDelete', InfoFixHouseDelete);
    registerSheet('InfoAddHouseDelete', InfoAddHouseDelete);
    registerSheet('InfoBuyPrice', InfoBuyPrice);
    registerSheet('InfoBuyDate', InfoBuyDate);
    registerSheet('InfoReservationCancel', InfoReservationCancel);
    registerSheet('InfoHandleWithDraw', InfoHandleWithDraw);
    registerSheet('joint', JointSheet);
    registerSheet('JointGain', JointSheetGain);
    registerSheet('ownHouseCount', OwnHouseCountSheet);
    registerSheet('confirm', ConfirmSheet);
    registerSheet('confirm2', ConfirmSheet2);
    registerSheet('own', OwnHouseSheet);
    registerSheet('own2', OwnHouseSheet2);
    registerSheet('gain', GainSheet);
    registerSheet('Expense', ExpenseSheet);
    registerSheet('Consulting', ConsultingSheet);
    registerSheet('directlivePeriod', directlivePeriod);
    registerSheet('review', ReviewSheet);
    registerSheet('logout', LogOutSheet);
    registerSheet('delete', DeleteHouseAlert);
    registerSheet('questionMarkDefinition', QuestionMarkDefinition);
    registerSheet('chooseHouseTypeAlert', ChooseHouseTypeAlert);
    registerSheet('chooseHouseDongHoAlert', ChooseHouseDongHoAlert);
    registerSheet('updateAddressAlert', UpdateAddressAlert);
    registerSheet('updateHouseDetailNameAlert', UpdateHouseDetailNameAlert);
    registerSheet('updateHouseNameAlert', UpdateHouseNameAlert);
    registerSheet('updatePubLandPriceAlert', UpdatePubLandPriceAlert);
    registerSheet('updateBuyPriceAlert', UpdateBuyPriceAlert);
    registerSheet('updateAreaMeterAlert', UpdateAreaMeterAlert);
    registerSheet('updateUserProportionAlert', UpdateUserProportionAlert);
    // registerSheet('updateMoveOutDateAlert', UpdateMoveOutDateAlert);
    // registerSheet('updateMoveInDateAlert', UpdateMoveInDateAlert);
    //registerSheet('updateBalanceDateAlert', UpdateBalanceDateAlert);
    registerSheet('updateConsultingDateAndTimeAlert', UpdateConsultingDateAndTimeAlert);
    registerSheet('updateConsultingContentAlert', UpdateConsultingContentAlert);
    registerSheet('updateBuyDateAlert', UpdateBuyDateAlert);
    registerSheet('updateContractDateAlert', UpdateContractDateAlert);



  }, []);





  return (
    <NavigationContainer>
      <SheetProvider>
        <Stack.Navigator screenOptions={horizontalAnimation}>
          {startLaunch === true ? (
            <Stack.Screen
              name="StartPage"
              component={StartPage}
              options={{ headerShown: false }}
            />
          ) : currentUser ? (
            <Stack.Group >
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerShown: false,
                  headerheaderTitleStyle: {
                    fontFamily: 'Pretendard-Bold',
                    fontSize: Math.min(PixelRatio.getFontScale() * fontSizeBase, fontSizeBase),
                    color: '#222',
                  },
                }}
              />
              <Stack.Screen name="Acquisition" component={Acquisition} />
              <Stack.Screen name="GainsTax" component={GainsTax} />
              <Stack.Screen name="CounselorList" component={CounselorList} />
              <Stack.Screen name="ConsultingReservation" component={ConsultingReservation} />
              <Stack.Screen name="ConsultingReservation2" component={ConsultingReservation2} />
              <Stack.Screen name="GainTaxRefund" component={GainTaxRefund} />

              <Stack.Screen name="FamilyHouse" component={FamilyHouse} />
              <Stack.Screen
                name="Information"
                component={Information}
              />
              <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="InfoCert" component={InfoCert} />
                <Stack.Screen name="InfoPrivacy" component={InfoPrivacy} />
                <Stack.Screen name="InfoLocation" component={InfoLocation} />
              </Stack.Group>
              <Stack.Screen
                name="RegisterFamilyHouse"
                component={RegisterFamilyHouse}
              />
              <Stack.Screen
                name="DoneResisterFamilyHouse"
                component={DoneResisterFamilyHouse}
              />
              <Stack.Screen name="DirectRegister" component={DirectRegister} />
              <Stack.Screen
                name="RegisterDirectHouse"
                component={RegisterDirectHouse}
              />
              <Stack.Screen
                name="OwnedHouseDetail"
                component={OwnedHouseDetail}
              />
              <Stack.Screen
                name="FixedHouse"
                component={FixedHouse}
              />
              <Stack.Screen
                name="AddHouse"
                component={AddHouse}
              />
              <Stack.Screen
                name="CertificationAcq"
                component={CertificationAcq}
              />
              <Stack.Screen
                name="CertificationGains"
                component={CertificationGains}
              />
              <Stack.Screen
                name="FixedHouseList"
                component={FixedHouseList}
              />
              <Stack.Screen
                name="AddHouseList"
                component={AddHouseList}
              />
              <Stack.Screen
                name="ReservationList"
                component={ReservationList}
              />
              <Stack.Screen
                name="ReservationDetail"
                component={ReservationDetail}
              />
              <Stack.Screen
                name="FixedHouseDetail"
                component={FixedHouseDetail}
              />
              <Stack.Screen
                name="OwnedFamilyHouse"
                component={OwnedFamilyHouse}
              />
              <Stack.Screen
                name="DoneSendFamilyHouse"
                component={DoneSendFamilyHouse}
              />
              <Stack.Screen
                name="AcquisitionChat"
                component={AcquisitionChat}
              />
              <Stack.Screen
                name="NetworkAlert"
                component={NetworkAlert}
              />
              <Stack.Screen name="GainsTaxChat" component={GainsTaxChat} />
              <Stack.Screen name="HouseDetail" component={HouseDetail} />
              <Stack.Screen name="OwnHousePrivacy" component={OwnHousePrivacy} />
              <Stack.Screen name="CertificationPrivacy" component={CertificationPrivacy} />
              <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Cert" component={Cert} />
                <Stack.Screen name="Privacy" component={Privacy} />
              </Stack.Group>
              <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Cert3" component={Cert3} />
                <Stack.Screen name="Privacy3" component={Privacy3} />
                <Stack.Screen name="Copyright3" component={Copyright3} />
                <Stack.Screen name="Gov24" component={Gov24} />
              </Stack.Group>
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Login_ID" component={Login_ID} />
              <Stack.Screen name="AddMembership" component={AddMembership} />
              <Stack.Screen name="AddMembershipFinish" component={AddMembershipFinish} />
              <Stack.Screen name="CheckTerms" component={CheckTerms} />
              <Stack.Screen name="IdFindScreen" component={IdFindScreen} />
              <Stack.Screen name="PasswordReSettingScreen" component={PasswordReSettingScreen} />
              <Stack.Screen name="PasswordChangeScreen" component={PasswordChangeScreen} />
              <Stack.Screen name="PhoneAuthConfirmScreen" component={PhoneAuthConfirmScreen} />
              <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
              <Stack.Screen name="PaymentCompletScreen" component={PaymentCompletScreen} />
              <Stack.Screen name="ConsultingReservationDetail" component={ConsultingReservationDetail} />
              <Stack.Screen name="ConsultingReservationHistory" component={ConsultingReservationHistory} />
              <Stack.Screen name="ConsultingReservation2Screen" component={ConsultingReservation2Screen} />
              <Stack.Screen
                name="ReservationListScreen"
                component={ReservationListScreen}
              />
              <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="Cert2" component={Cert2} />
                <Stack.Screen name="Privacy2" component={Privacy2} />
                <Stack.Screen name="Location2" component={Location2} />
                <Stack.Screen name="Marketing2" component={Marketing2} />
              </Stack.Group>
              <Stack.Screen
                name="NetworkAlert"
                component={NetworkAlert}
              />
              <Stack.Screen name="LoginWebview" component={LoginWebview}
                options={{ headerShown: false }} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </SheetProvider>
    </NavigationContainer >
  );
};

export default AppNavigator;
