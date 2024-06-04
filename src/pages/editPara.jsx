import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, SafeAreaView, StyleSheet, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import CadastroButton from '../components/cadastroBT';
import { useNavigation } from '@react-navigation/native';
import { database, auth } from '../services/firebaseConfig';
import { update, ref, onValue, off } from 'firebase/database';

const EditParans = ({ route }) => {
    const navigation = useNavigation();
    const { aquario } = route.params;
    const aquarioId = aquario.id;

    const [uidUser, setUidUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUidUser(user.uid);
            } else {
                setUidUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const [aquarioInfo, setAquarioInfo] = useState(null);

    useEffect(() => {
        const aquarioRef = ref(database, `users/${uidUser}/aquarios/${aquarioId}`);
        const listener = onValue(aquarioRef, (snapshot) => {
            setAquarioInfo(snapshot.val());
        });
        return () => off(aquarioRef, 'value', listener);
    }, [aquarioId, uidUser]);

    const [nome, setNome] = useState(aquario.name);
    const [phMin, setPhMin] = useState(aquario.phMin);
    const [phMax, setPhMax] = useState(aquario.phMax);
    const [tempMin, setTempMin] = useState(aquario.tempMin);
    const [tempMax, setTempMax] = useState(aquario.tempMax);
    const [ligarLampadaH, setLigarLampadaH] = useState(aquario.ligarLampadaH);
    const [desligarLampadaH, setDesligarLampadaH] = useState(aquario.desligarLampadaH);
    const [ligarTomada3H, setLigarTomada3H] = useState(aquario.ligarTomada3H);
    const [desligarTomada3H, setDesligarTomada3H] = useState(aquario.desligarTomada3H);
    const [ligarTomada4H, setLigarTomada4H] = useState(aquario.ligarTomada4H);
    const [desligarTomada4H, setDesligarTomada4H] = useState(aquario.desligarTomada4H);

    useEffect(() => {
        if (aquarioInfo) {
            setNome(aquarioInfo.nome);
            setPhMin(aquarioInfo.ph.min);
            setPhMax(aquarioInfo.ph.max);
            setTempMin(aquarioInfo.temperatura.min);
            setTempMax(aquarioInfo.temperatura.max);
            setLigarLampadaH(aquarioInfo.horarios?.ligarLampadaH || '');
            setDesligarLampadaH(aquarioInfo.horarios?.desligarLampadaH || '');
            setLigarTomada3H(aquarioInfo.horarios?.ligarTomada3H || '');
            setDesligarTomada3H(aquarioInfo.horarios?.desligarTomada3H || '');
            setLigarTomada4H(aquarioInfo.horarios?.ligarTomada4H || '');
            setDesligarTomada4H(aquarioInfo.horarios?.desligarTomada4H || '');
        }
    }, [aquarioInfo]);

    const handleUpdate = async () => {
        if (!nome) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const updatedAquario = {
            nome,
            ph: { min: phMin, max: phMax },
            temperatura: { min: tempMin, max: tempMax },
            horarios: {
                ligarLampadaH: ligarLampadaH || aquarioInfo.horarios?.ligarLampadaH,
                desligarLampadaH: desligarLampadaH || aquarioInfo.horarios?.desligarLampadaH,
                ligarTomada3H: ligarTomada3H || aquarioInfo.horarios?.ligarTomada3H,
                desligarTomada3H: desligarTomada3H || aquarioInfo.horarios?.desligarTomada3H,
                ligarTomada4H: ligarTomada4H || aquarioInfo.horarios?.ligarTomada4H,
                desligarTomada4H: desligarTomada4H || aquarioInfo.horarios?.desligarTomada4H,
            },
        };

        try {
            const aquarioRef = ref(database, `users/${uidUser}/aquarios/${aquarioId}`);
            await update(aquarioRef, updatedAquario);
            Alert.alert('Sucesso', 'Parâmetros atualizados com sucesso.');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar os parâmetros.');
            console.error(error);
        }
    };

    const handleCancelar = () => {
        navigation.navigate('Home');
    };

    const handleSubMin = () => {
        const newPhMin = parseFloat((phMin - 0.05).toFixed(2));
        if (newPhMin >= 0) {
            setPhMin(newPhMin);
        }
    };

    const handleSubMax = () => {
        const newPhMax = parseFloat((phMax - 0.05).toFixed(2));
        if (newPhMax >= 0 && newPhMax <= 14) {
            setPhMax(newPhMax);
        }
    };

    const handleAddMin = () => {
        const newPhMin = parseFloat((phMin + 0.05).toFixed(2));
        if (newPhMin <= 14) {
            setPhMin(newPhMin);
        }
    };

    const handleAddMax = () => {
        const newPhMax = parseFloat((phMax + 0.05).toFixed(2));
        if (newPhMax <= 14) {
            setPhMax(newPhMax);
        }
    };

    const handleTempSubMin = () => {
        const newTempMin = tempMin - 0.5;
        if (newTempMin >= 1) {
            setTempMin(newTempMin);
        }
    };

    const handleTempSubMax = () => {
        const newTempMax = tempMax - 0.5;
        if (newTempMax >= 1) {
            setTempMax(newTempMax);
        }
    };

    const handleTempAddMin = () => {
        setTempMin(tempMin + 0.5);
    };

    const handleTempAddMax = () => {
        setTempMax(tempMax + 0.5);
    };

    const formatarHorario = (input, setHorario) => {
        if (input.length === 2 && !input.includes(':')) {
            setHorario(input + ':');
        } else {
            setHorario(input);
        }
    };

    const validarHorario = (horario, setHorario) => {
        const horarioRegex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;
        if (!horarioRegex.test(horario)) {
            Alert.alert('Erro', 'Por favor, insira um horário válido no formato HH:MM.');
            setHorario('');
            return;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/backgroundDois.jpeg')} style={styles.backgroundImage}>
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)']}
                    style={styles.gradient}
                />
                <ScrollView>
                    <Text style={styles.titulo}>Edição de Parâmetros</Text>
                    <TextInput
                        placeholder={nome}
                        placeholderTextColor={'#FFF'}
                        style={styles.inputName}
                        value={nome}
                        onChangeText={setNome}
                    />
                    <View style={styles.containerStarts}>
                        <View style={styles.containerParans}>
                            <Image source={require('../img/ph.png')}
                                style={styles.imageNames}
                            />
                            <Text style={styles.tituloParans}>PH</Text>
                        </View>
                        <View style={styles.containerParans}>
                            <Text style={styles.textsParansPhTemp}>Mínimo</Text>
                            <Text style={styles.textsParansPhTemp}>Máximo</Text>
                        </View>
                        <View style={styles.containerParans}>
                            <View style={styles.containerInputParans}>
                                <TouchableWithoutFeedback onPress={handleSubMin}>
                                    <AntDesign name="minuscircleo" size={21} color="black" style={styles.iconsAddMin} />
                                </TouchableWithoutFeedback>
                                <Text style={styles.inputsParans}>{phMin}</Text>
                                <TouchableWithoutFeedback onPress={handleAddMin}>
                                    <AntDesign name="pluscircleo" size={21} color="black" style={styles.iconsAddMin} />
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={styles.containerInputParans}>
                                <TouchableWithoutFeedback onPress={handleSubMax}>
                                    <AntDesign name="minuscircleo" size={21} color="black" style={styles.iconsAddMin} />
                                </TouchableWithoutFeedback>
                                <Text style={styles.inputsParans}>{phMax}</Text>
                                <TouchableWithoutFeedback onPress={handleAddMax}>
                                    <AntDesign name="pluscircleo" size={21} color="black" style={styles.iconsAddMin} />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <View style={styles.containerStarts}>
                        <View style={styles.containerParans}>
                            <FontAwesome5 name="thermometer-three-quarters" size={20} color="black" style={styles.espacamentoMarginIcon} />
                            <Text style={styles.tituloParans}>Temperatura</Text>
                        </View>
                        <View style={styles.containerParans}>
                            <Text style={styles.textsParansPhTemp}>Mínimo</Text>
                            <Text style={styles.textsParansPhTemp}>Máximo</Text>
                        </View>
                        <View style={styles.containerParans}>
                            <View style={styles.containerInputParans}>
                                <TouchableWithoutFeedback onPress={handleTempSubMin}>
                                    <AntDesign name="minuscircleo" size={21} color="black" style={styles.iconsAddMin} />
                                </TouchableWithoutFeedback>
                                <Text style={styles.inputsParans}>{tempMin}</Text>
                                <TouchableWithoutFeedback onPress={handleTempAddMin}>
                                    <AntDesign name="pluscircleo" size={21} color="black" style={styles.iconsAddMin} />
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={styles.containerInputParans}>
                                <TouchableWithoutFeedback onPress={handleTempSubMax}>
                                    <AntDesign name="minuscircleo" size={21} color="black" style={styles.iconsAddMin} />
                                </TouchableWithoutFeedback>
                                <Text style={styles.inputsParans}>{tempMax}</Text>
                                <TouchableWithoutFeedback onPress={handleTempAddMax}>
                                    <AntDesign name="pluscircleo" size={21} color="black" style={styles.iconsAddMin} />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <View style={styles.containerStarts}>
                        <View style={styles.containerParans}>
                            <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="black" style={styles.espacamentoMarginIcon} />
                            <Text style={styles.tituloParans}>Iluminação</Text>
                        </View>
                        <View style={styles.containerParans}>
                            <Text style={styles.textsOnParans}>Liga</Text>
                            <Text style={styles.textsOffParans}>Desliga</Text>
                        </View>
                        <View style={styles.containerInputParans}>
                            <TextInput
                                placeholder={ligarLampadaH}
                                placeholderTextColor={'#000'}
                                style={styles.inputsParansTwo}
                                value={ligarLampadaH}
                                onChangeText={(input) => formatarHorario(input, setLigarLampadaH)}
                                onBlur={() => validarHorario(ligarLampadaH, setLigarLampadaH)}
                                maxLength={5}
                            />
                            <TextInput
                                placeholder={desligarLampadaH}
                                placeholderTextColor={'#000'}
                                style={styles.inputsParansTwo}
                                value={desligarLampadaH}
                                onChangeText={(input) => formatarHorario(input, setDesligarLampadaH)}
                                onBlur={() => validarHorario(desligarLampadaH, setDesligarLampadaH)}
                                maxLength={5}
                            />
                        </View>
                    </View>
                    <View style={styles.containerStarts}>
                        <View style={styles.containerParans}>
                            <MaterialIcons name="outlet" size={24} color="black" style={styles.marginIconTomada} />
                            <Text style={styles.tituloParans}>Tomada 3</Text>
                        </View>
                        <View style={styles.containerParans}>
                            <Text style={styles.textsOnParans}>Liga</Text>
                            <Text style={styles.textsOffParans}>Desliga</Text>
                        </View>
                        <View style={styles.containerInputParans}>
                            <TextInput
                                placeholder={ligarTomada3H}
                                placeholderTextColor={'#000'}
                                style={styles.inputsParansTwo}
                                value={ligarTomada3H}
                                onChangeText={(input) => formatarHorario(input, setLigarTomada3H)}
                                onBlur={() => validarHorario(ligarTomada3H, setLigarTomada3H)}
                                maxLength={5}
                            />
                            <TextInput
                                placeholder={desligarTomada3H}
                                placeholderTextColor={'#000'}
                                style={styles.inputsParansTwo}
                                value={desligarTomada3H}
                                onChangeText={(input) => formatarHorario(input, setDesligarTomada3H)}
                                onBlur={() => validarHorario(desligarTomada3H, setDesligarTomada3H)}
                                maxLength={5}
                            />
                        </View>
                    </View>
                    <View style={styles.containerStarts}>
                        <View style={styles.containerParans}>
                            <MaterialIcons name="outlet" size={24} color="black" style={styles.marginIconTomada} />
                            <Text style={styles.tituloParans}>Tomada 4</Text>
                        </View>
                        <View style={styles.containerParans}>
                            <Text style={styles.textsOnParans}>Liga</Text>
                            <Text style={styles.textsOffParans}>Desliga</Text>
                        </View>
                        <View style={styles.containerInputParans}>
                            <TextInput
                                placeholder={ligarTomada4H}
                                placeholderTextColor={'#000'}
                                style={styles.inputsParansTwo}
                                value={ligarTomada4H}
                                onChangeText={(input) => formatarHorario(input, setLigarTomada4H)}
                                onBlur={() => validarHorario(ligarTomada4H, setLigarTomada4H)}
                                maxLength={5}
                            />
                            <TextInput
                                placeholder={desligarTomada4H}
                                placeholderTextColor={'#000'}
                                style={styles.inputsParansTwo}
                                value={desligarTomada4H}
                                onChangeText={(input) => formatarHorario(input, setDesligarTomada4H)}
                                onBlur={() => validarHorario(desligarTomada4H, setDesligarTomada4H)}
                                maxLength={5}
                            />
                        </View>
                    </View>
                    <View style={styles.containerBT}>
                        <CadastroButton title={'Cadastrar'} corFundo={'#33FF66'} onPressButton={handleUpdate} />
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
    },
    gradient: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    titulo: {
        color: '#FFF',
        fontSize: 24,
        marginTop: 30,
        alignSelf: 'center',
    },
    inputName: {
        alignSelf: 'center',
        fontSize: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#FFF',
        borderStyle: 'dotted',
        height: 30,
        width: 'auto',
        textAlign: 'center',
        color: '#FFF',
        marginTop: 10,
    },
    containerStarts: {
        backgroundColor: '#86CBDB',
        width: 280,
        height: 90,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        marginTop: 20,
        alignContent: 'center',
        alignSelf: 'center',
    },
    containerParans: {
        alignContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 6,
    },
    containerInputParans: {
        alignContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        marginHorizontal: 20,
    },
    tituloParans: {
        fontSize: 18,
        color: '#000',
    },
    textsParansPhTemp: {
        fontSize: 14,
        color: '#000',
        marginHorizontal: 42,
    },
    textsOffParans: {
        fontSize: 14,
        color: '#000',
        marginHorizontal: 54,
    },
    textsOnParans: {
        fontSize: 14,
        color: '#000',
        marginHorizontal: 46,
    },
    inputsParans: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderStyle: 'dotted',
        width: 'auto',
        textAlign: 'center',
        height: 20,
        fontSize: 18,
    },
    inputsParansTwo: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderStyle: 'dotted',
        width: 'auto',
        textAlign: 'center',
        height: 20,
        fontSize: 18,
        marginHorizontal: 46,
        marginTop: 6,
    },
    imageNames: {
        marginTop: 2,
        width: 24,
        height: 24,
        marginRight: 4,
    },
    iconsAddMin: {
        backgroundColor: '#FFF',
        borderRadius: 100,
        marginHorizontal: 4,
    },
    containerBT: {
        marginTop: 20,
        alignSelf: 'center',
    },
    espacamentoMarginIcon: {
        marginRight: 4,
    },
    marginIconTomada: {
        marginTop: 2,
    },
});

export default EditParans;