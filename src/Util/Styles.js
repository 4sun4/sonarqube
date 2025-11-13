import { StyleSheet, Dimensions, Platform } from 'react-native';

import Colors from '../Util/Colors';
import { normalizeSize } from './CommonFun';
const { height, width } = Dimensions.get('window');
let little = height / 7
export const l_margin = height / 7;
export const Margin = width / 20;
export const MinMargin = width / 40;
export const BigTitleFontSize = height / 35;
export const TitleFontSize = height / 45;
export const BorderRadius = height / 200;
export const ButtonFontSize = height / 60;

const THUMB_RADIUS = 12;

export default StyleSheet.create(props => ({
    //  --------------------- GlobalStyle -------------------------

    SafeAreaViewStyle: { flex: 1, backgroundColor: Colors.White, width: '100%' },
    Container: { flex: 1, backgroundColor: Colors.White, },


    //  --------------------- GlobalInput -------------------------
    input_style: { color: Colors.Black, fontSize: TitleFontSize, minHeight: 0 },
    LabelStyle: { fontSize: TitleFontSize, color: Colors.Theme_D_Grey },
    DefaultErrorStyle: { height: 0, margin: 0 },
    IPIconDefaultContainerStyle: { height: 'auto', marginVertical: 0, paddingHorizontal: height / 100 },


    // --------------------- LOADER -------------------------

    LoaderCont: { zIndex: 1, width: width, height: height, alignItems: 'center', position: 'absolute', justifyContent: "center", backgroundColor: Colors.LoaderBG, },
    ThankuCont: { width: width, height: height, alignItems: 'center',  justifyContent: "center", backgroundColor: Colors.White, },
    LoaderCircle: { elevation: 2, width: height / 12, height: height / 12, borderRadius: height / 24, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.White },

    // --------------------- DateOverlay -------------------------

    DateOverlay:{alignItems: 'center', justifyContent: 'center', padding: height / 100 },

    // ----------------------  Slider -------------------------
    ThumbRoot: { width: THUMB_RADIUS *2, height: THUMB_RADIUS * 2,borderRadius:THUMB_RADIUS * 2, backgroundColor: Colors.ThemeGreen },


    // ----------------------  Availability -------------------------

    horizontalContainer:{ flexDirection: 'row',justifyContent: 'space-between', marginTop: MinMargin,},




    InputLabel: { color: Colors.IText,fontSize: height / 55 },
    InputError: { fontSize: height / 65 },
    InputLIcon: { paddingLeft: height / little, paddingRight: height / little, },
    InputCont: { backgroundColor: Colors.bottomTab, padding: height / little, borderRadius: height / little, borderColor: '#D8D8D8' },
    InputStyle: {fontSize: height / 45, color: Colors.IText },

    // ---------------------- Pdf View -------------------------
    PdfView: { padding: Margin, flex: 1, },
    PdfViewTitle: { fontWeight: '700', fontSize: height / 40, marginBottom: MinMargin },




    // ---------------------- Image Pop Up -------------------------
    IPopUp: { alignItems: "center", justifyContent: 'center', width: width, height: height, position: 'absolute', zIndex: 1, backgroundColor: Colors.overlay },
    IPopUpView: { borderRadius: height / 100, width: width, alignItems: 'center', justifyContent: 'center', },
    IPopUpView1: { alignSelf: "flex-end", width: height / 25, position: 'absolute', top: -(height / 20) },
    IPopUpView2: { width: width, alignItems: 'center' },
    IPopUpView3: { alignSelf: "flex-end", width: height / 25},
    IPopUpView4: { width: (height / 25), height: (height / 25), marginBottom: width / 20, justifyContent: "center"},
    IPopUpView5: { alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.White, borderRadius: height / 150, overflow: 'hidden', marginHorizontal: width / 40},
    IPopUpView6: { backgroundColor: Colors.White, width: (width - (width / 20) - (width / 40)), height: (width - (width / 20) - (width / 40)) },
    AlcJcc:{ alignItems: 'center', justifyContent: 'center' },




    w10: { width: '10%' },
    w20: { width: '20%' },
    w15: { width: '15%' },
    w25: { width: '25%' },
    w30: { width: '30%' },
    w33: { width: '33.33%' },
    w35: { width: '35%' },
    w40: { width: '40%' },
    w45: { width: '45%' },
    w48: { width: '48%' },
    w50: { width: '50%' },
    w60: { width: '60%' },
    w70: { width: '70%' },
    w75: { width: '75%' },
    w80: { width: '80%' },
    w85: { width: '85%' },
    w90: { width: '90%' },
    w95: { width: '95%' },
    w97: { width: '97%' },
    w98: { width: '98%' },
    w99: { width: '99%' },
    w100: { width: '100%' },
    w500: { width: 500 },
    mt8: { marginTop: '8%' },
    halfRight: { marginLeft: '4%', width: '48%' },
    halfRight1: { marginLeft: '4%', width: '40%' },
  
    mh20: { marginLeft: 20, marginRight: 20 },
    mh10: { marginLeft: 10, marginRight: 10 },
    mh11: { marginLeft: 11, marginRight: 11 },
    mh5: { marginLeft: 5, marginRight: 5 },
    ph20: { paddingLeft: 20, paddingRight: 20 },
    ph10: { paddingLeft: 10, paddingRight: 10 },
    ph11: { paddingLeft: 11, paddingRight: 11 },
    ph5: { paddingLeft: 5, paddingRight: 5 },
    mt0: { marginTop: 0 },
    mt5: { marginTop: 5 },
    mt10: { marginTop: 10 },
    mt15: { marginTop: 15 },
    mt20: { marginTop: 20 },
    mt_20: { marginTop: normalizeSize(20)},
    mt30: { marginTop: 30 },
    mt_30: { marginTop: normalizeSize(30)},
    mt40: { marginTop: 40 },
    mt50: { marginTop: 50 },
    mt100: { marginTop: 100 },
    mb0: { marginBottom: 0 },
    mb10: { marginBottom: 10 },
    mb20: { marginBottom: 20 },
    p0: { padding: 0 },
    p10: { padding: 10 },
    p30: { padding: 30 },
    pb0: { paddingBottom: 0 },
    pb5: { paddingBottom: 5 },
    pb10: { paddingBottom: 10 },
    pb20: { paddingBottom: 20 },
    pt0: { paddingTop: 0 },
    pt5: { paddingTop: 5 },
    pt10: { paddingTop: 10 },
    pt20: { paddingTop: 20 },
    m10: { margin: 10 },
    mv5: { marginVertical: 5 },
    mv7: { marginVertical: 7 },
    mv10: { marginVertical: 10 },
    mv15: { marginVertical: 15 },
    mv20: { marginVertical: 20 },
    mv30: { marginVertical: 30 },
    mv40: { marginVertical: 40 },
    pv5: { paddingVertical: 5 },
    pv10: { paddingVertical: 10 },
    pv20: { paddingVertical: 20 },
    pv25: { paddingVertical: 25 },
    pv30: { paddingVertical: 30 },
    pv40: { paddingVertical: 40 },
    ml0: { marginLeft: 0 },
    ml5: { marginLeft: 5 },
    ml_5: {marginLeft:normalizeSize(5)},
    ml_10: {marginLeft:normalizeSize(10)},
    ml10: { marginLeft: 10 },
    ml20: { marginLeft: 20 },
    ml30: { marginLeft: 30 },
    ml40: { marginLeft: 40 },
    mr10: { marginRight: 10 },
    mr20: { marginRight: 20 },
    mr30: { marginRight: 30 },
    mr40: { marginRight: 40 },
    pl0: { paddingLeft: 0 },
    pl10: { paddingLeft: 10 },
    pl20: { paddingLeft: 20 },
    jcenter: { justifyContent: 'center' },
    mt10AlCenter: { marginTop: 10, alignItems: 'center' },
    alCenter: { alignItems: 'center' },
    alEnd: { alignItems: 'flex-end' },
    alSelfCenter: { alignSelf:'center'},
    flRowalSelfCenterACenter: { alignSelf:'center', flexDirection:'row', alignItems:'center'},
    jSpaceBetween: { justifyContent: 'space-between' },
    flEnd: { alignSelf: 'flex-end' },
    fw5: { fontWeight: '500' },
    fwb: { fontWeight: 'bold' },
    w100H100: { width: '100%', height: '100%' },
    fs13: { fontSize: normalizeSize(13) },
    fs14: { fontSize: normalizeSize(14) },
    fs15: { fontSize: normalizeSize(15) },
    fs16: { fontSize: normalizeSize(16) },







    fl1: { flex: 1 },
    fl2: { flex: 2 },
    fl3: { flex: 3 },
    fl4: { flex: 4 },
    fl5: { flex: 5 },
    fl6: { flex: 6 },
    fl7: { flex: 7 },
    fl9: { flex: 9 },
    fl10: { flex: 10 },

}))