import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Alert,
  Button,
  TextInput,
  Icon,
  TouchableOpacity,
  ImageBackground,
  TouchableHighlight,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

import ImagePicker from 'react-native-image-crop-picker';


const Profile = ({navigation}) => {
  const [imageType, onChangeImageType] = useState(true);
  const [image, setImage] = useState('./imgs/images.jpg');

  // bs = React.createRef();
  const bs = React.useRef();
  const fall = new Animated.Value(1);
  const [count, setCount] = useState(0);
  const onPress = () => setCount(count + 1);

  useEffect(() => {
    if (image != './imgs/images.jpg'){
      fetch('http://10.0.2.2:8000/auth/profile/', {
        method: 'post',
        body: JSON.stringify({
          username: username,
          first_name: "ddg",
          last_name: "nb",
          email: global.email,
          avatar: image,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(function (data) {
          // setImage(data["avatarLink"])
        }
      )
    }
    else{
      onChangeImageType(true);
    }
  }, [image])

  useEffect(() => {
    fetch('http://10.0.2.2:8000/auth/profile/')
      .then(response => response.json())
      .then(function (data) {
        // console.log(data);
        if (data["avatarLink"]){
          setImage(data["avatarLink"]);
          onChangeImageType(false);
        }
        else{
          onChangeImageType(true);
        }
        // bs.current.snapTo(1);
      })
  }, [])

  const choosePhotoFromLibrary = () => {
    
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      // console.log(image);
      setImage(image.path);
      onChangeImageType(false);
      bs.current.snapTo(1);
    }).catch(error => {
      // console.log("error");
      if (image == './imgs/images.jpg'){
        onChangeImageType(true);
      }
      bs.current.snapTo(1);
    });
  }

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      // console.log(image);
      setImage(image.path);
      onChangeImageType(false);
      bs.current.snapTo(1);
    }).catch(error => {
      // console.log("error");
      if (image == './imgs/images.jpg'){
        onChangeImageType(true);
      }
      bs.current.snapTo(1);
    });
  }

  function signout(){
    global.username = "Guest";
    global.accountId = -1;
    global.uid = -1;
    global.email = "";
    Alert.alert(
      "Good bye!",
      "",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate('Login');
            // console.log(username);
          }
        }
      ]
    );
  }

  renderInner = () => (
    <View style={group1.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={group1.panelTitle}>Upload Photo</Text>
        <Text style={group1.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity style={group1.panelButton} onPress={takePhotoFromCamera}>
        <Text style={group1.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={group1.panelButton} onPress={choosePhotoFromLibrary}>
        <Text style={group1.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={group1.panelButton}
        onPress={() => bs.current.snapTo(1)}>
        <Text style={group1.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style = {group1.header}>
      <View style = {group1.panelHeader}>
        <View style = {group1.panelHandle}></View>
      </View>
    </View>
  );

  return (
    <View style = {group1.rectangle1}>
      <Text style = {group1.profile}>PROFILE</Text>
      {/* <View style={group1.imageBox}>
        <Image source={require('./imgs/woman3.png')} style={group1.image} />
      </View> */}
      <Text style = {group1.userName}>{global.username}</Text>
      {/* <Image souce={require('./imgs/Vector7.png')} style={group1.nameFill} /> */}
      {/* <Image souce={require('./imgs/Vector10.png')} style={group1.emailFill} /> */}
      <Text style = {group1.userEmail}>{global.email}</Text>
      <View style={group1.line1}></View>
      <Text style = {group1.funnyThing}>More features are under development ... </Text>
      <TouchableOpacity style={group1.frame} onPress={onPress}>
        <Text style={group1.funnyText}>Can't wait </Text>
      </TouchableOpacity>
      {/* <View style={styles.countContainer}> */}
      <Text style={styles.urge}>Have been urged for </Text>
      <Text style={styles.urgeText}>times !</Text>
      <Text style={styles.countText}>
        {count}
      </Text>
      {/* </View> */}

      <View style={group1.line2}></View>
      <TouchableOpacity
        style={group1.signout}
        onPress={() => signout()}
      >
        <Text style={group1.signoutText}>Sign Out</Text>
      </TouchableOpacity>


      <View style = {group1.container}>
        <BottomSheet
          ref={bs}
          snapPoints={[-200, -510, 0]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}  // We can swipe to close the bottom sheet
          enabledContentTapInteraction={false} 
        />
        <Animated.View 
          style={{
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),}}
        >
          {/* <View style = {{alignItems: 'center'}}> */}
          <TouchableOpacity onPress = {() => bs.current.snapTo(0)}>
            <View style={group1.imageBox}>
              {imageType ? <Image source={require('./imgs/woman3.png')} style={group1.image} />
              : <Image source = {{uri: image,}} style = {group1.image}/>}
            </View>
            
          </TouchableOpacity>
          {/* </View> */}
        </Animated.View>
      </View>
    </View>
      

  );
};

const styles = StyleSheet.create({
  urge: {
    position: 'absolute',
    width: 300,
    height: 120,
    top: 495,
    left: 60,

    color: 'rgba(66,150,144,255)',
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'left',

  },
  urgeText: {
    position: 'absolute',
    width: 120,
    height: 120,
    top: 490,
    left: 260,

    color: 'rgba(66,150,144,255)',
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 40,
    textAlign: 'left',
  },
  countText: {
    position: 'absolute',
    width: 50,
    height: 120,
    top: 490,
    left: 225,

    color: 'rgba(66,150,144,255)',
    fontFamily: 'Inter',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 40,
    textAlign: 'left',
  }
});

const group1 = StyleSheet.create({
  image: {
    /* Woman */
    position: 'absolute',
    width: 110,
    height: 110,
    top: 6,
    left: 6,
    // left: 118,
    borderRadius: 50,
  },
  imageBox: {
    /* imageBox */
    position: 'absolute',
    width: 120,
    height: 120,
    top: 100,
    left: 147,

    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderStyle: 'solid',
    elevation: 3,
    borderRadius: 120,
  },
  rectangle1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 414,
    height: 220,

    backgroundColor: 'rgba(66,150,144,255)',
  },

  container: {
    flex: 1,
  },
  profile: {
    /* Profile */
    position: 'absolute',
    width: 150,
    height: 30,
    top: 44,
    left: 130,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },

  userName: {
    /* UserName */
    position: 'absolute',
    width: 167,
    height: 34,
    top: 280,
    left: 124,

    color: 'rgb(34, 34, 34)',
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'center',
  },
  userEmail: {
    /* UserEmail */
    position: 'absolute',
    width: 420,
    height: 25,
    top: 320,

    color: 'rgb(67, 136, 131)',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
  },
  line1: {
    /* Line1 */
    position: 'absolute',
    width: 325,
    height: 1,
    top: 360,
    left: 40,

    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 1,
  },
  funnyThing: {
    /* funny thing */
    position: 'absolute',
    width: 420,
    height: 40,
    top: 410,
    // left: 40,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
  },
  frame: {
    /* Frame */
    position: 'relative',
    width: 320,
    height: 40,
    top: 440,
    left: 40,

    // backgroundColor: 'rgba(63,135,130,0.2)',
    backgroundColor: "#DDDDDD",
    borderRadius: 40,
    elevation: 2,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  funnyText: {
    /* spend smarter save more */
    position: 'absolute',
    width: 301,
    height: 76,
    top: 2,
    // left: 20,

    color: "rgba(0,0,0,0.5)",
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 38,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  line2: {
    /* Line1 */
    position: 'absolute',
    width: 325,
    height: 1,
    top: 590,
    left: 40,

    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 1,
  },
  signoutText: {
    top: 4,
    color: 'rgba(66,150,144,255)',
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center', 
  },
  signout: {
    /* Delete Botton */
    position: 'absolute',
    width: 180,
    height: 40,
    top: 620,
    left: 120,

    borderWidth: 1,
    borderColor: 'rgba(66,150,144,255)',
    borderStyle: 'solid',
    backgroundColor: 'rgb(244, 244, 244)',
    elevation: 1,
    borderRadius: 30,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  
  panelHeader: {
    alignItems: 'center',
  },
  
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },

  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    width: 300,
    padding: 8,
    left: 40,
    borderRadius: 30,
    backgroundColor: 'rgba(66,150,144,255)',
    alignItems: 'center',
    elevation: 5,
    marginVertical: 5,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Profile;
