import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, ImageBackground, Alert, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

// State details with tourism URLs
const stateDetails = {
  'Andhra Pradesh': 'https://www.apttdc.in/',
  'Arunachal Pradesh': 'https://www.arunachaltourism.com/',
  'Assam': 'https://www.assamtourism.gov.in/',
  'Bihar': 'https://www.bihartourism.gov.in/',
  'Chhattisgarh': 'https://www.tourism.cg.gov.in/',
  'Goa': 'https://www.goatourism.gov.in/',
  'Gujarat': 'https://www.gujarattourism.com/',
  'Haryana': 'https://www.haryanatourism.gov.in/',
  'Himachal Pradesh': 'https://www.hptdc.in/',
  'Jharkhand': 'https://www.jharkhandtourism.gov.in/',
  'Karnataka': 'https://www.karnatakatourism.org/',
  'Kerala': 'https://www.keralatourism.org/',
  'Madhya Pradesh': 'https://www.mptourism.com/',
  'Maharashtra': 'https://www.maharashtratourism.gov.in/',
  'Manipur': 'http://manipurtourism.gov.in/',
  'Meghalaya': 'https://www.meghalayatourism.in/',
  'Mizoram': 'https://www.tourismmizoram.com/',
  'Nagaland': 'https://www.nagalandtourism.gov.in/',
  'Odisha': 'https://www.odishatourism.gov.in/',
  'Punjab': 'http://punjabtourism.gov.in/',
  'Rajasthan': 'https://www.tourism.rajasthan.gov.in/',
  'Sikkim': 'https://sikkimtourism.gov.in/',
  'Tamil Nadu': 'https://www.tamilnadu-tourism.com/',
  'Telangana': 'https://www.telanganatourism.gov.in/',
  'Tripura': 'https://tripuratourism.gov.in/',
  'Uttar Pradesh': 'http://uptourism.gov.in/',
  'Uttarakhand': 'https://www.uttarakhandtourism.gov.in/',
  'West Bengal': 'https://www.wbtourismgov.in/',
};



const loginUser = async (email, password, setAuthState) => {
  try {
    const response = await axios.post('https://66ac-118-185-234-163.ngrok-free.app/login', { email, password });
    if (response.data) {
      setAuthState('welcome');
    } else {
      Alert.alert('Error', 'Invalid email or password.');
    }
  } catch (error) {
    Alert.alert('Error', 'An error occurred during login.');
  }
};



const createAccount = async (email, password, setAuthState) => {
  try {
    const response = await axios.post('https://66ac-118-185-234-163.ngrok-free.app/createaccount', { email, password });
    console.log('Response:', response); // Debugging line
    if (response.status === 201) {
      setAuthState('welcome');
    }
  } catch (error) {
    console.log('Error response:', error.response); // Debugging line
    if (error.response && error.response.status === 409) {
      Alert.alert('Error', 'Your account is already created. Please log in.');
    } else {
      Alert.alert('Error', 'An error occurred during account creation.');
    }
  }
};




const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

function CombinedScreen() {
  const [authState, setAuthState] = useState('auth'); // 'auth', 'welcome', 'stateList', 'stateDetails'
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  const handleAuthSubmit = async () => {
    setLoading(true);
    if (isLogin) {
      await loginUser(email, password, setAuthState);
    } else {
      await createAccount(email, password, setAuthState);
      setIsLogin(true);
    }
    setLoading(false);
  };

  const renderAuthScreen = () => (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Create Account'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleAuthSubmit}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Create Account'}</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.link}>{isLogin ? 'Create an account' : 'Already have an account? Login'}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderWelcomeScreen = () => (
    <ImageBackground
      source={require('../assets/images/myyy.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>Namaste India</Text>
          <Text style={styles.introText}>
            Explore the cultural richness, historical landmarks, and spiritual beliefs of India's states and cities.
          </Text>
          <TouchableOpacity style={styles.exploreButton} onPress={() => setAuthState('stateList')}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );

  const renderStateListScreen = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>STATES OF INDIA</Text>
      {states.map((state, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => {
            setSelectedState(state);
            setAuthState('stateDetails');
          }}
        >
          <View style={styles.itemContent}>
            <MaterialIcons name="location-pin" size={24} color="#007BFF" />
            <Text style={styles.itemText}>{state}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
      style={styles.goBackButton}
      onPress={() => setAuthState('auth')} // Navigate back to auth screen
    >
      <Text style={styles.goBackButtonText}>Go Back</Text>
    </TouchableOpacity>
    </ScrollView>
  );

  
  const renderStateDetailsScreen = () => {
    if (!selectedState || !stateDetails[selectedState]) {
      return (
        <View style={styles.container}>
          <Text style={styles.detailsText}>Details not available</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setAuthState('stateList')}
          >
            <Text style={styles.buttonText}>Go to state list</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    const tourismUrl = stateDetails[selectedState];
  
    return (
      <ImageBackground
        source={require('../assets/images/CSBG.jpg')} // Replace with your background image
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>Welcome to {selectedState}</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => Linking.openURL(tourismUrl)}
            >
              <Text style={styles.buttonText}>Explore More</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setAuthState('stateList')}
            >
              <Text style={styles.buttonText}>Go back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  };
  

  return (
    <View style={{ flex: 1 }}>
      {authState === 'auth' && renderAuthScreen()}
      {authState === 'welcome' && renderWelcomeScreen()}
      {authState === 'stateList' && renderStateListScreen()}
      {authState === 'stateDetails' && renderStateDetailsScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
  link: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  introText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  exploreButton: {
    //backgroundColor: '#007BFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    marginLeft: 10,
  },
  stateImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  }
  
});

export default CombinedScreen;