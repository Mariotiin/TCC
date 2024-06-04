import React, { useState } from 'react';
import { Text, View, ImageBackground, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useForm } from 'react-hook-form';
import CadastroButton from '../components/cadastroBT';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import validationSchemaCadas from '../components/validationSchemaCadas';
import { yupResolver } from '@hookform/resolvers/yup';
import { auth, database } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { ref, set } from "firebase/database";

const Cadastro = () => {
    const { handleSubmit, setValue, trigger, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchemaCadas)
    });
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirmPassword: '',
        email: '',
        cpf: '',
        telefone: ''
    });

    const handleCadastrar = async () => {
        const cleanedFormData = {
            ...formData,
            cpf: formData.cpf.replace(/[^\d]/g, ''),
            telefone: formData.telefone.replace(/[^\d]/g, '')
        };
        const methods = await fetchSignInMethodsForEmail(auth, cleanedFormData.email);
        if (methods.length > 0) {
            console.error("E-mail já está em uso.");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
        
            const cleanedCpf = formData.cpf.replace(/[^\d]/g, '');
            const cleanedTelefone = formData.telefone.replace(/[^\d]/g, '');

            await set(ref(database, 'users/' + user.uid), {
                name: formData.name,
                email: formData.email,
                cpf: cleanedCpf,
                telefone: cleanedTelefone,
            });
        
            console.log("User created successfully:", user.uid);
            setFormData({
                name: '',
                password: '',
                confirmPassword: '',
                email: '',
                cpf: '',
                telefone: ''
            });
            navigation.navigate('Login');
        } catch (error) {
            console.error("Error creating user:", error);
        }        
    };    

    const handleCancelar = () => {
        setFormData({
            name: '',
            password: '',
            confirmPassword: '',
            email: '',
            cpf: '',
            telefone: ''
        });
        navigation.navigate('Login');
    };

    const formatCPF = (value) => {
        return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    };

    const formatTelefone = (value) => {
        return value.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
    };

    const handleInputChange = (fieldName, value) => {
        if (fieldName === "cpf") {
            const formattedValue = formatCPF(value);
            setFormData({ ...formData, [fieldName]: formattedValue });
            setValue(fieldName, formattedValue);
            trigger(fieldName);
        } else if (fieldName === "telefone") {
            const formattedValue = formatTelefone(value);
            setFormData({ ...formData, [fieldName]: formattedValue });
            setValue(fieldName, formattedValue);
            trigger(fieldName);
        } else {
            setFormData({ ...formData, [fieldName]: value });
            setValue(fieldName, value);
            trigger(fieldName);
        }
    };

    const handleInputFocus = (fieldName) => {
        if (errors[fieldName]) {
            setFormData({ ...formData, [fieldName]: '' });
            setValue(fieldName, '');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/backgroundDois.jpeg')} style={styles.backgroundImage}>
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.7)']}
                    style={styles.gradient}
                />
                <ScrollView>
                    <Text style={styles.title}>Crie sua conta</Text>
                    <View style={styles.conErrorAndInput}>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.nameInputs}>Name:</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(value) => handleInputChange("name", value)}
                                onFocus={() => handleInputFocus("name")}
                            />
                        </View>
                        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                    </View>
                    <View style={styles.conErrorAndInput}>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.nameInputs}>Senha:</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.password}
                                onChangeText={(value) => handleInputChange("password", value)}
                                onFocus={() => handleInputFocus("password")}
                                secureTextEntry={true}
                            />
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                    </View>
                    <View style={styles.conErrorAndInput}>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.nameInputs}>Confirmar senha:</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.confirmPassword}
                                onChangeText={(value) => handleInputChange("confirmPassword", value)}
                                onFocus={() => handleInputFocus("confirmPassword")}
                                secureTextEntry={true}
                            />
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
                    </View>
                    <View style={styles.conErrorAndInput}>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.nameInputs}>Email:</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={(value) => handleInputChange("email", value)}
                                onFocus={() => handleInputFocus("email")}
                                keyboardType="email-address"
                            />
                        </View>
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                    </View>
                    <View style={styles.conErrorAndInput}>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.nameInputs}>CPF:</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.cpf}
                                onChangeText={(value) => handleInputChange("cpf", value)}
                                onFocus={() => handleInputFocus("cpf")}
                                keyboardType="numeric"
                                maxLength={14}
                            />
                        </View>
                        {errors.cpf && <Text style={styles.errorText}>{errors.cpf.message}</Text>}
                    </View>
                    <View style={styles.conErrorAndInput}>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.nameInputs}>Telefone:</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.telefone}
                                onChangeText={(value) => handleInputChange("telefone", value)}
                                onFocus={() => handleInputFocus("telefone")}
                                keyboardType="phone-pad"
                                maxLength={15}
                            />
                        </View>
                        {errors.telefone && <Text style={styles.errorText}>{errors.telefone.message}</Text>}
                    </View>
                    <View style={styles.containerBT}>
                        <CadastroButton title={'Cadastrar'} corFundo={'#33FF66'} onPressButton={handleSubmit(handleCadastrar)} />
                        <CadastroButton title={'Cancelar'} corFundo={'#EF2020'} onPressButton={handleCancelar} />
                    </View>
                </ScrollView>
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
        justifyContent: 'center',
    },
    gradient: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    title: {
        marginTop: 20,
        color: '#FFF',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 80,
        alignSelf: 'center',
    },
    inputsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 400,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    input: {
        flex: 1,
        paddingLeft: 4,
        marginBottom: 7,
        marginTop: 5,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        width: '100%',
        fontSize: 14,
        height: 22,
    },
    nameInputs: {
        paddingBottom: 2,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        fontWeight: 'bold',
        height: 20,
    },
    containerBT: {
        marginTop: 70,
        alignSelf: 'center',
    },
    conErrorAndInput: {
        backgroundColor: '#97D7FF',
        marginTop: 20,
        borderWidth: 2,
        borderRadius: 30,
        borderColor: '#000',
        height: 50,
    },
    errorText: {
        color: 'red',
        marginLeft: 20,
        marginTop: -7,
    },
});

export default Cadastro;
