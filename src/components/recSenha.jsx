import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import BTPop from './btPop';
import Fontisto from '@expo/vector-icons/Fontisto';

const RecuperarSenha = ({ visible, hideModal, emailModal, handleEmailConfirmation }) => {
  const [email, setEmail] = useState(emailModal);
  const [error, setError] = useState('');

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    return () => {
      setError('');
    };
  }, []);

  const handleSendEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Email de recuperação enviado!');
      handleEmailConfirmation();
      clearInput();
      hideModal();
    } catch (error) {
      setError('Email inválido');
    }
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    hideModal();
    clearInput();
    clearError();
  };

  const clearInput = () => {
    setEmail('');
    clearError();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.backgroundModalFora}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Informe seu email usado para cadastro para que possamos enviar o código de recuperação</Text>
              <View style={styles.rowContainer}>
                <Text style={styles.textInput}>Email:</Text>
                <TextInput
                  style={styles.ModalInput}
                  placeholder='Insira seu email'
                  onChangeText={(text) => {
                    setEmail(text);
                    clearError();
                  }}
                  value={email}
                  onBlur={clearInput}
                  onFocus={clearError}
                  placeholderTextColor={'#28231D'}
                />
                <Fontisto name="email" size={20} color="black" style={styles.iconStyle} />
              </View>
              {error !== '' && <Text style={styles.errorText}>{error}</Text>}
              <View style={{ marginTop: error ? 0 : 10 }}>
                <BTPop title={'Solicitar email'} onPressButton={handleSendEmail} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backgroundModalFora: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: 310,
    height: 136,
    backgroundColor: '#90B1DB',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    width: 290,
    fontSize: 14,
    marginBottom: 4,
    marginTop: -12,
    color: '#FFF',
    textAlign: 'center'
  },
  ModalInput: {
    width: 200,
    padding: 10,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    height: 30,
    paddingBottom: 1,
    marginTop: -6,
    fontSize: 16,
  },
  textInput: {
    fontSize: 16,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    height: 22,
    alignSelf: 'center',
    paddingBottom: 1,
    marginTop: 2,
  },
  iconStyle: {
    marginTop: 2.5,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 2,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  }
});

export default RecuperarSenha;