export const GOOGLE_MAPS_APIKEY = 'AIzaSyB3g4THPixQb2yNNtZIbix8tjHuBeFnfGI';
export const PLACES_APIKEY = 'b10f183f34514252b83d779bb1c9e54e';

import {Dimensions} from 'react-native';
import { store } from '../redux/Store';

const appConfig =()=>{
const {width, height} = Dimensions.get('window');
// Base URL
const defaultBaseUrl = "https://auth.workforcemgr.com/api/v1/"

const initialBaseUrl =()=> store.getState().loginStatus.baseUrl

const newURL = initialBaseUrl() ? initialBaseUrl() : ""

const URL = `${newURL}/api/`;

const LIVE = `${newURL}/api/candidate/`;

const LIVE1 = `${newURL}/api/settings/`;

const mapUrl = 'http://maps.google.com/maps?saddr=';
const GDriveOpenURL = 'http://docs.google.com/gview?embedded=true&url=';
const PlacesApiURL='https://api.geoapify.com/v1/geocode/autocomplete?text=';

const uploadmyCompliance = LIVE + 'uploadmyCompliance';
const getFileTypes = LIVE + 'getFileTypes';
const getShiftTypeList = LIVE + 'getShiftTypeList';
const getEmergencyContact = LIVE + 'getEmergencyContact';
const getCandidateStatus = LIVE + 'getCandidateStatus';
const getDetails = LIVE + 'getDetails';
const getCompliance = LIVE + 'getCompliance';
const getCandidateFiles = LIVE + 'getCandidateFiles';
const uploadMyAvatar = LIVE + 'uploadMyAvatar';
const getTimesheetApprovers = LIVE + 'getApprovers';
const getCandidateTimesheetBookings = LIVE + 'getCandidateTimesheetBookings';
const myWorkHistory = LIVE + 'myWorkHistory';
const getRoster = LIVE + 'roster';
const getSharedFiles = LIVE + 'shared-files';

const myShiftToday = LIVE + 'myShiftsToday';

const getCandidateTravelDistance = LIVE + 'getCandidateTravelDistance';
const updateCandidateStatus = LIVE + 'updateCandidateStatus';
const getCandidateShiftPreferences = LIVE + 'getCandidateShiftPreferences';
const saveCandidateShiftPreferences = LIVE + 'saveCandidateShiftPreferences';
const getPayslips = LIVE + 'getPayslips';
const uploadMyFiles = LIVE + 'uploadMyFiles';
const updateDetails = LIVE + 'updateDetails';
const updateCandidateTravelDistance = LIVE + 'updateCandidateTravelDistance';
const candidateAttributeList = LIVE + 'candidateAttributeList';
const getTimesheetStatuses = LIVE + 'getTimesheetStatuses';
const updateComplianceDocument = LIVE + 'updateComplianceDocument';
const downloadComplianceDocument = LIVE + 'downloadComplianceDocument';
const viewCompliance = LIVE + 'viewCompliance';
const clockIn = LIVE + 'clockIn';
const clockOut = LIVE + 'clockOut';
const getClockIns = LIVE + 'getClockIns';
const getClockInData = LIVE + 'getClockInData';

const login =  defaultBaseUrl + 'login';
const forgotPassword =  defaultBaseUrl + 'forgot-password';
const changePassword =  defaultBaseUrl + 'change-password';
const deleteAccount = LIVE + 'deleteAccount';
const submitTimesheet = LIVE + 'submitTimesheet';
const downloadCandidateAvatar = LIVE + 'downloadCandidateAvatar';
const getTimesheets = LIVE + 'getTimesheets';
const getTimesheetData = LIVE + 'getTimesheet';
const downloadCandidateFile = LIVE + 'downloadCandidateFile';
const downloadPayslip = LIVE + 'downloadPayslip';
const sendSignUpConfirmationEmail = LIVE + 'sendSignUpConfirmationEmail'

const sendPayQuery = LIVE1 + 'sendPayQuery';
const getAboutUs = LIVE1 + 'getAboutUs';
const getSupportHelpText = LIVE1 + 'getSupportHelpText';
const getContactInstructions = LIVE1 + 'getContactInstructions';
const sendFeedback = LIVE1 + 'sendFeedback';
const getAndUpdateCandidateAppSettings = LIVE1 + 'getAndUpdateCandidateAppSettings';
const getUsersForMessages = URL + 'messages/getMessageUsers';
const getUsersForMessages_2 = URL + 'messages/getUsersForMessages';
const setCandidateDeviceToken = URL + 'messages/setCandidateDeviceToken';
const getCandidateReceivedMessages = URL + 'messages/getCandidateMessages';
const sendMessage = URL + 'messages/sendMessage';
const getCandidateSentMessages = URL + 'messages/getCandidateSentMessages';
const setMessageReadStatus = URL + 'messages/setMessageReadStatus';
const signup = URL + 'onboarding/register';
const verify = URL + 'onboarding/verify';
const profileUpdateDetails = URL + 'candidate/updateDetails';
const profileUploadMyAvatar = URL + 'candidate/uploadMyAvatar';
const getWorkTypes = URL + 'settings/getWorkTypes';
const getSalaryTypes = URL + 'settings/getSalaryTypes';
const getNoticePeriods = URL + 'settings/getNoticePeriods';
const addCurrentJob = URL + 'candidate/addCurrentJob';
const getJobGroups = URL + 'settings/getJobGroups';
const getJobTypes = URL + 'settings/getJobTypes';
const addIdealJobs = URL + 'candidate/addIdealJobs';
const profileUploadMyFiles = URL + 'candidate/uploadMyFiles';
const workEligibility = LIVE + 'workEligibility';
const getCountryList = LIVE + 'getPassportNationalityList';

const createLeaveRequest = LIVE + 'leave/create';
const getLeaveRequests = LIVE + 'leave/list';
const updateLeaveRequest = LIVE + 'leave/update';
const cancelLeaveRequest = LIVE + 'leave/cancel';
const getLeaveTypes = LIVE + 'leave/types';
const getLeaveStatus = LIVE + 'leave/statuses';
const getLeaveBalance = LIVE + 'leave/balances';

const getWorkEligibilityDetails =  URL + 'candidate/getWorkEligibilityDetails'
const getBadgeCount = URL + 'candidate/getBadgeCount'

return {
  LIVE: LIVE,
  mapUrl: mapUrl,
  uploadmyCompliance: uploadmyCompliance,
  getFileTypes: getFileTypes,
  getShiftTypeList: getShiftTypeList,
  getEmergencyContact: getEmergencyContact,
  getCandidateStatus: getCandidateStatus,
  getDetails: getDetails,
  getCompliance: getCompliance,
  getCandidateFiles: getCandidateFiles,
  uploadMyAvatar: uploadMyAvatar,
  getTimesheetApprovers: getTimesheetApprovers,
  getCandidateTimesheetBookings: getCandidateTimesheetBookings,
  myWorkHistory: myWorkHistory,
  myShiftToday:myShiftToday,
  deleteAccount: deleteAccount,
  getCandidateTravelDistance: getCandidateTravelDistance,
  updateCandidateStatus: updateCandidateStatus,
  getCandidateShiftPreferences: getCandidateShiftPreferences,
  saveCandidateShiftPreferences: saveCandidateShiftPreferences,
  getPayslips: getPayslips,
  uploadMyFiles: uploadMyFiles,
  updateDetails: updateDetails,
  updateCandidateTravelDistance: updateCandidateTravelDistance,
  candidateAttributeList: candidateAttributeList,
  width: width,
  height: height,
  SubmitTimesheet: submitTimesheet,
  login: login,
  forgotPassword:forgotPassword,
  changePassword:changePassword,
  DownloadCandidateAvatar: downloadCandidateAvatar,
  GetTimesheets: getTimesheets,
  GetTimesheetData: getTimesheetData,
  DownloadCandidateFile: downloadCandidateFile,
  DownloadPayslip: downloadPayslip,
  SendPayQuery: sendPayQuery,
  getAboutUs: getAboutUs,
  getSupportHelpText: getSupportHelpText,
  getContactInstructions: getContactInstructions,
  sendFeedback: sendFeedback,
  getAndUpdateCandidateAppSettings: getAndUpdateCandidateAppSettings,
  getTimesheetStatuses: getTimesheetStatuses,
  downloadComplianceDocument: downloadComplianceDocument,
  updateComplianceDocument: updateComplianceDocument,
  viewCompliance: viewCompliance,
  GDriveOpenURL: GDriveOpenURL,
  PlacesApiURL:PlacesApiURL,
  PLACES_APIKEY:PLACES_APIKEY,
  GOOGLE_MAPS_APIKEY: GOOGLE_MAPS_APIKEY,
  clockIn: clockIn,
  clockOut: clockOut,
  getClockIns: getClockIns,
  getClockInData: getClockInData,
  getUsersForMessages: getUsersForMessages,
  getUsersForMessages_2: getUsersForMessages_2,
  setCandidateDeviceToken: setCandidateDeviceToken,
  getCandidateReceivedMessages: getCandidateReceivedMessages,
  sendMessage: sendMessage,
  getCandidateSentMessages: getCandidateSentMessages,
  setMessageReadStatus: setMessageReadStatus,
  signup: signup,
  verify: verify,
  profileUpdateDetails: profileUpdateDetails,
  profileUploadMyAvatar: profileUploadMyAvatar,
  getWorkTypes: getWorkTypes,
  getSalaryTypes: getSalaryTypes,
  getNoticePeriods: getNoticePeriods,
  addCurrentJob: addCurrentJob,
  getJobGroups: getJobGroups,
  getJobTypes: getJobTypes,
  addIdealJobs: addIdealJobs,
  profileUploadMyFiles: profileUploadMyFiles,
  sendSignUpConfirmationEmail:sendSignUpConfirmationEmail,
  workEligibility:workEligibility,
  getRoster:getRoster,
  getSharedFiles:getSharedFiles,
  getCountryList,
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveRequest,
  cancelLeaveRequest,
  getLeaveTypes,
  getLeaveStatus,
  getLeaveBalance,
  getWorkEligibilityDetails,
  getBadgeCount,
  defaultBaseUrl,
};
}

export default appConfig
