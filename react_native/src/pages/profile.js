import React, {useState} from 'react';
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
  TextInput,
  Icon,
  TouchableOpacity,
  ImageBackground,
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



const Profile = () => {
  const [image, setImage] = useState('./imgs/images.jpg');

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImage(image.path);
      this.bs.current.snapTo(1);
    });
  }

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImage(image.path);
      this.bs.current.snapTo(1);
    });
  }

  bs = React.createRef();
  fall = new Animated.Value(1);

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
        onPress={() => this.bs.current.snapTo(1)}>
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
      <View style = {group1.container}>
        <BottomSheet
          ref={this.bs}
          snapPoints={[330,0]}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={1}
          callbackNode={this.fall}
          enabledGestureInteraction={true}  // We can swipe to close the bottom sheet
          enabledContentTapInteraction={false} 
        />
        <Animated.View style={{margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
      }}>
            <View style = {{alignItems: 'center'}}>
              <TouchableOpacity onPress = {() => this.bs.current.snapTo(0)}>
                <View style = {{
                  height: 300,
                  weight: 100,
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <ImageBackground
                  source = {{uri: image,}}
                  style = {group1.images}
                  imageStyle = {borderRadius = 15}
                  >
                  </ImageBackground>
                </View>
              </TouchableOpacity>


            </View>
        </Animated.View>
      </View>
      <Text style = {group1.profile}>Profile</Text>
      {/* <Image source={require('./imgs/images.jpg')} style={group1.images} /> */}
      <Text style = {group1.userName}>Wang Yuhao</Text>

      {/* <Image souce={require('./imgs/Vector7.png')} style={group1.nameFill} /> */}
      <Text style = {group1.userNameEdit}>Wang Yuhao</Text>

      {/* <Image souce={require('./imgs/Vector10.png')} style={group1.emailFill} /> */}
      <Text style = {group1.userEmail}>119010321@link.cuhk.edu.cn</Text>


      <TouchableOpacity style={group1.signOutButton}>
        <Text style={group1.signOutButtonTitle}>Sign Out</Text>
      </TouchableOpacity>

    
      
  
    </View>
      

  );
};

const group1 = StyleSheet.create({
  /* Rectangle 1 */
  rectangle1: {
    position: 'absolute',
    width: 414,
    height: 247,

    backgroundColor: 'rgba(66,150,144,255)',
  },

  container: {
    flex: 1,
  },

  /* Profile */
  profile: {
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

    
  /* Images */
  images: {
    // position: 'absolute',
    width: 100,
    height: 100,
    // marginTop: 50,
    // marginBottom: 100,
    // borderRadius: 100,
    // borderWidth: 2,
    borderColor: 'white',
  },

  /* UserName */
  userName: {
    position: 'absolute',
    width: 167,
    height: 24,
    top: 300,
    left: 124,

    color: 'rgb(34, 34, 34)',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
  },

  // /* NameFill */
  // nameFill: {
  //   position: 'absolute',
  //   width: 30,
  //   height: 30,
  //   top: 380,
  //   left: 35,
  // },

  /* UserNameEdit */
  userNameEdit: {
    position: 'absolute',
    width: 97,
    height: 19,
    top: 380,
    left: 95,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'left',
  },
  
  /* UserEmail */
  userEmail: {
    position: 'absolute',
    width: 97,
    height: 19,
    top: 450,
    left: 95,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'left',
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },

  signOutButton: {
    position: 'absolute',
    top: 500,

    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  signOutButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Profile;
