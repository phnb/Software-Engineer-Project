import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const CardInfo = ({navigation}) => {
  const type = false;
  let str = type ? '+' : '-';
  let useage = 'Starbucks';
  let displayType = type ? 'Income' : 'Expense';
  let date = 'Apr 18, 2022';
  let remark = 'Oh, God! Caramel Macchiato is really good!';

  return (
    <View>
      <View style={group1.rectangle1}>
        <Text style={group1.recordDetails}>RECORD DETAILS</Text>
      </View>
      <View style={group1.rectangle2}>
        <View style={group1.imageBorder}>
          <Image style={group1.img} source={require('./imgs/image2.png')} />
        </View>
        <View style={[group1.type,  {backgroundColor: type ? 'rgba(67, 136, 131, 0.1)' : 'rgba(249, 91, 81, 0.1)'}]}>
          <Text style={[group1.typeText, , {color: type ? 'rgb(67, 136, 131)' : 'rgb(249, 91, 81)'}]}>{displayType}</Text>
        </View>
        <Text style={group1.amount}>$ 600,000</Text>
        <Text style={group1.details}>Record Details</Text>
        <Image style={group1.vector} source={require('./imgs/Vector10.png')} />
        <Text style={group1.status}>Status</Text>
        <Text style={[group1.statusText, {color: type ? 'rgb(67, 136, 131)' : 'rgb(249, 91, 81)'}]}>{displayType}</Text>
        <Text style={group1.usage}>Usage</Text>
        <Text style={group1.usageText}>{useage}</Text>
        <Text style={group1.date}>Date</Text>
        <Text style={group1.dateText}>{date}</Text>
        <Text style={group1.remark}>Remark</Text>
        <Text style={group1.remarkText}>{remark}</Text>
        <View style={group1.line}></View>
        <TouchableOpacity
            style={group1.delete}
            onPress={() => navigation.navigate('Homepage')}
        >
          <Text style={group1.deleteText}>Delete Record</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const group1 = StyleSheet.create({
  deleteText: {
    top: 3,
    color: 'rgba(66,150,144,255)',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'center', 
  },
  delete: {
    /* Delete Botton */
    position: 'absolute',
    width: 150,
    height: 30,
    top: 520,
    left: 136,

    borderWidth: 1,
    borderColor: 'rgba(66,150,144,255)',
    borderStyle: 'solid',
    backgroundColor: 'rgb(255, 255, 255)',
    elevation: 1,
    borderRadius: 30,
  },
  line: {
    /* Line 4 */
    position: 'absolute',
    width: 325,
    height: 1,
    top: 470,
    left: 40,

    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 1,
  },
  remarkText: {
     /* Remark */
     position: 'absolute',
     width: 200,
     height: 75,
     top: 395,
     right: 50,
 
     color: 'rgb(0, 0, 0)',
     fontFamily: 'Inter',
     fontSize: 16,
     fontWeight: '600',
     lineHeight: 19,
     textAlign: 'right',   
  },
  remark: {
    /* Remark */
    position: 'absolute',
    width: 70,
    height: 25,
    top: 395,
    left: 40,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'left',
  },
  dateText: {
    /* Date */
    position: 'absolute',
    width: 100,
    height: 25,
    top: 360,
    right: 50,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19,
    textAlign: 'right',
  },
  date: {
    /* Date */
    position: 'absolute',
    width: 70,
    height: 25,
    top: 360,
    left: 40,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'left',
  },
  usageText: {
    /* Usage */
    position: 'absolute',
    width: 70,
    height: 25,
    top: 325,
    right: 50,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19,
    textAlign: 'right',
  },
  usage: {
    /* Usage */
    position: 'absolute',
    width: 70,
    height: 25,
    top: 325,
    left: 40,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'left',
  },
  statusText: {
    position: 'absolute',
    width: 70,
    height: 25,
    top: 290,
    right: 50,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'right',
  },
  status: {
    /* Status */
    position: 'absolute',
    width: 70,
    height: 25,
    top: 290,
    left: 40,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'left',
  },
  vector: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 250,
    left: 340,
    // backgroundColor: 'rgb(66, 66, 66',
  },
  details: {
    /* Transaction details */
    position: 'absolute',
    width: 158,
    height: 28,
    top: 240,
    left: 40,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 28,
    textAlign: 'left',
  },
  amount: {
    /* $ 850.00 */
    position: 'absolute',
    width: 200,
    height: 33,
    top: 170,
    left: 100,

    color: 'rgb(0, 0, 0)',
    fontFamily:'Inter',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 33,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  type: {
    /* Type */
    position: 'absolute',
    width: 84,
    height: 25,
    top: 132,
    left: 165,

    borderRadius: 40,
  },
  typeText: {
    /* TypeText */
    position: 'absolute',
    width: 70,
    height: 20,
    top: 4,
    left: 6,

    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 17,
    textAlign: 'center',
  },
  img: {
    width: 70,
    height: 70,
    // top: 40,
    // left: 170,
  },
  imageBorder: {
    width: 70,
    height: 70,
    top: 40,
    left: 170,

    elevation: 10,
    // box-shadow: 0px 22px 35px rgba(0, 0, 0, 0.08),
    borderRadius: 70,
  },
  rectangle1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 414,
    height: 247,

    backgroundColor: 'rgba(66,150,144,255)',
  },
  rectangle2: {
    /* Rectangle 2 */
    position: 'absolute',
    width: 414,
    height: 680,
    top: 120,
    left: 0,

    backgroundColor: 'rgb(255, 255, 255)',
    elevation: 10,
    borderRadius: 30,
  },
  recordDetails: {
    /* Add Expense */
    position: 'absolute',
    width: 250,
    height: 30,
    top: 44,
    left: 80,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },
});


export default CardInfo;