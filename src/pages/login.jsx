import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Linking, ImageBackground, Image, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import LoginButton from '../components/loginBT';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../services/firebaseConfig';
import RecuperarSenha from '../components/recSenha';
import { ref, get } from "firebase/database";
import UserContext from '../components/estadoUsuario';

const ErrorText = ({ error }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
);

const Login = () => {
  const navigation = useNavigation(); 
  const { user, uid } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setError('');
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userInfo = snapshot.val();
        clearInputs();
        setError('');
        navigation.navigate('Home');
      } else {
        console.error('Dados do usuário não encontrados no Realtime Database');
        setError('Erro ao buscar dados do usuário.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Credenciais inválidas. Por favor, verifique seu e-mail e senha.');
    }
  };

  const handleScreenCadastro = () => {
    navigation.navigate('Cadastro');
    clearInputs();
  };

  const openWhatsApp = () => {
    Linking.openURL('https://api.whatsapp.com/send?phone=5544933005588');
  };

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  };

  const [visibleEmailModal, setVisibleEmailModal] = useState(false);
  const [emailModal, setEmailModal] = useState('');

  const handleOpenEmailModal = () => {
    setVisibleEmailModal(true);
    clearInputs();
    setError('');
  };

  const handleCloseEmailModal = () => setVisibleEmailModal(false);

  const handleEmailConfirmation = () => {
    handleCloseEmailModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../img/backgroundUm.jpeg')} style={styles.backgroundImage}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <View style={styles.logoContainer}>
          <Image source={require('../img/logo.jpeg')} style={styles.logo} />
        </View>
        <Text style={styles.tittle}>AquaInsigth</Text>
        <View style={styles.inputsContainer}>
          <TextInput
            style={styles.inputs}
            placeholder='Email...'
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholderTextColor={'#4F4F4F'}
            onFocus={() => setError('')}
          />
          <TextInput
            style={styles.inputs}
            placeholder='Senha...'
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholderTextColor={'#4F4F4F'}
            onFocus={() => setError('')}
          />
        </View>
        {error ? <ErrorText error={error} /> : null}
        <TouchableWithoutFeedback onPress={handleOpenEmailModal}>
          <Text style={styles.esqueciSenhaText}>Esqueci senha</Text>
        </TouchableWithoutFeedback>
        <RecuperarSenha
          visible={visibleEmailModal}
          hideModal={handleCloseEmailModal}
          emailModal={emailModal}
          handleEmailConfirmation={handleEmailConfirmation}
        />
        <View style={styles.buttonsContainer}>
          <LoginButton title={'Entrar'} onPressButton={handleLogin} />
          <LoginButton title={'Cadastrar'} onPressButton={handleScreenCadastro} />
        </View>
        <TouchableWithoutFeedback activeOpacity={0.9} onPress={openWhatsApp}>
          <Text style={styles.contactSup}>Contato ao Suporte</Text>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoContainer: {
    marginTop: 50,
    borderWidth: 2,
    borderColor: '#13ADEA',
    borderRadius: 30,
    overflow: 'hidden',
  },
  logo: {
    resizeMode: 'contain',
    width: 153,
    height: 153,
  },
  tittle: {
    color: '#6CE3FF',
    fontSize: 46,
    fontWeight: 'bold',
    textShadowColor: '#11114E',
    textShadowOffset: { width: 2, height: 6 },
    textShadowRadius: 20,
    marginBottom: 10,
  },
  inputsContainer: {
    marginTop: 30,
  },
  inputs: {
    marginTop: 50,
    paddingLeft: 16,
    fontSize: 20,
    width: 275,
    height: 40,
    backgroundColor: '#86CBDB',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonsContainer: {
    marginTop: 100,
  },
  contactSup: {
    marginTop: 76,
    color: '#fff',
    fontSize: 12,
  },
  textPopUp: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
  },
  esqueciSenhaText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});

export default Login;