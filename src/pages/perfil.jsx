import React, { useState, useEffect, useContext } from 'react';
import { Text, View, ImageBackground, SafeAreaView, StyleSheet, TouchableWithoutFeedback, TextInput, ScrollView, Alert } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import validationSchemaPerfil from '../components/validationSchemaPerfil';
import RecuperarSenha from '../components/recSenha';
import { auth, database } from '../services/firebaseConfig';
import { ref, update } from 'firebase/database';
import UserContext from '../components/estadoUsuario';

const Perfil = () => {
    const navigation = useNavigation();
    const { user, setUser } = useContext(UserContext);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { control, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
        resolver: yupResolver(validationSchemaPerfil),
        mode: 'onBlur'
    });

    const handleBack = () => {
        navigation.navigate('Home');
    };

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 3) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
        }
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
    };

    const cleanPhoneNumber = (value) => {
        return value.replace(/[^\d]/g, '');
    };

    const onSubmit = async (data) => {
        if (!data.telefone) {
            Alert.alert('Erro', 'Preencha o telefone para salvar as alterações.');
            return;
        }

        const cleanedData = {
            telefone: cleanPhoneNumber(data.telefone),
        };

        try {
            const userAuth = auth.currentUser;
            const updates = {};

            if (cleanedData.telefone && cleanedData.telefone !== user.telefone) {
                updates['/users/' + userAuth.uid + '/telefone'] = cleanedData.telefone;
            }

            await update(ref(database), updates);
            console.log("Atualizações realizadas:", updates);

            setUser((prevUser) => ({
                ...prevUser,
                ...cleanedData,
            }));

            Alert.alert('Sucesso', 'Informações atualizadas com sucesso.');

        } catch (error) {
            console.error('Erro ao atualizar informações:', error);
            Alert.alert('Erro', 'Não foi possível atualizar as informações. Tente novamente.');
        }
    };

    const handleBlur = async () => {
        const isValid = await trigger();
        if (isValid) {
            onSubmit(getValues());
        }
    };

    const handlePasswordContainerPress = () => {
        setIsModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/backgroundDois.jpeg')} style={styles.backgroundImage}>
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)']}
                    style={styles.gradient}
                />
                <AntDesign name='left' size={60} color='#FFF' style={styles.iconLeft} onPress={handleBack} />
                <ScrollView>
                    <View style={styles.perfilContainer}>
                        <Entypo name="user" size={102} color="black" style={styles.perfilIcon} />
                    </View>
                    <View style={styles.containerInfos}>
                        <Text style={styles.infosText}>Nome: </Text>
                        <Text style={styles.infosClient}>{user?.name}</Text>
                    </View>
                    <View style={styles.containerInfos}>
                        <TouchableWithoutFeedback onPress={handlePasswordContainerPress}>
                            <View style={styles.rowContainer}>
                                <Text style={styles.infosText}>Senha:</Text>
                                <Text style={styles.infosClient}>****</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.containerInfos}>
                        <Text style={styles.infosText}>Email:</Text>
                        <Text style={styles.infosClient}>{user?.email}</Text>
                    </View>
                    <View style={styles.containerInfos}>
                        <Text style={styles.infosText}>CPF:</Text>
                        <Text style={styles.infosClient}>{user?.cpf}</Text>
                    </View>
                    <View style={styles.containerInfos}>
                        <Text style={styles.infosText}>Telefone:</Text>
                        <Controller
                            control={control}
                            name="telefone"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.infosTextInput, errors.telefone && styles.errorInput]}
                                    placeholder={user?.telefone}
                                    placeholderTextColor={'#28231D'}
                                    onBlur={() => {
                                        onBlur();
                                        handleBlur();
                                    }}
                                    onChangeText={(text) => onChange(formatPhoneNumber(text))}
                                    value={value}
                                    keyboardType="phone-pad"
                                    maxLength={15}
                                />
                            )}
                        />
                    </View>
                    {errors.telefone && <Text style={styles.errorText}>{errors.telefone.message}</Text>}
                </ScrollView>
            </ImageBackground>
            <RecuperarSenha visible={isModalVisible} hideModal={() => setIsModalVisible(false)} />
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
    iconLeft: {
        marginTop: 40,
        marginLeft: -300,
    },
    perfilContainer: {
        marginTop: 30,
        width: 150,
        height: 150,
        backgroundColor: '#86CBDB',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 100,
        alignItems: 'center',
        alignSelf: 'center'
    },
    perfilIcon: {
        marginTop: 14,
    },
    containerInfos: {
        flexDirection: 'row',
        height: 40,
        width: 300,
        backgroundColor: '#86CBDB',
        marginTop: 30,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#000',
    },
    rowContainer: {
        flexDirection: 'row',
    },
    infosText: {
        fontWeight: 'bold',
        marginTop: 8,
        marginLeft: 8,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        borderStyle: 'dotted',
        height: 20,
    },
    infosClient: {
        color: '#28231D',
        marginTop: 8,
        paddingLeft: 4,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        borderStyle: 'dotted',
        height: 20,
    },
    infosTextInput: {
        paddingLeft: 4,
        marginTop: 8,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        borderStyle: 'dotted',
        height: 20,
        flex: 1
    },
    errorInput: {
        borderBottomColor: 'red',
    },
    errorText: {
        color: 'red',
        marginLeft: 20,
        marginTop: -2,
    }
});

export default Perfil;