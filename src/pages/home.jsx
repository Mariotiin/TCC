import React, { useContext, useEffect, useState } from 'react';
import { Text, View, ImageBackground, SafeAreaView, Image, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, MaterialCommunityIcons, EvilIcons, Entypo, Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import UserContext from '../components/estadoUsuario';
import { ref, get } from 'firebase/database';
import { database } from '../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const navigation = useNavigation();
    const { user, uid } = useContext(UserContext);
    const [aquarios, setAquarios] = useState([]);

    useEffect(() => {
        if (user && uid) {
            fetchAquarios(uid);
        } else {
            console.log('Usuário não encontrado');
        }
    }, [user, uid]);

    const fetchAquarios = async (uid) => {
        try {
            const aquariosRef = ref(database, `users/${uid}/aquarios`);
            const snapshot = await get(aquariosRef);
            if (snapshot.exists()) {
                const aquariosData = snapshot.val();
                const formattedData = Object.keys(aquariosData).map(aquarioId => {
                    const aquario = aquariosData[aquarioId];
                    return {
                        id: aquarioId,
                        name: aquario.nome || 'Aquário sem nome',
                        temperature: aquario.temperatura ? `${aquario.temperatura.tempValue}°C` : '--°C',
                        fluxo: aquario.fluxo !== undefined ? (aquario.fluxo ? 'Estável' : 'Instável') : '--',
                        ph: aquario.ph ? aquario.ph.phValue : '--',
                        nivel: aquario.nivel !== undefined ? (aquario.nivel ? 'Ok' : 'Baixo') : '--',
                        phMin: aquario.phMin ? aquario.ph.min : 0,
                        phMax: aquario.phMax ? aquario.ph.max : 14,
                        tempMin: aquario.tempMin ? aquario.temperatura.min : 25,
                        tempMax: aquario.tempMax ? aquario.temperatura.max : 25,
                        ligarLampadaH: aquario.ligarLampadaH ? aquario.horarios.ligarLampadaH : '00:00',
                        desligarLampadaH: aquario.desligarLampadaH ? aquario.horarios.desligarLampadaH : '00:00',
                        ligarTomada3H: aquario.ligarTomada3H ? aquario.horarios.ligarTomada3H : '00:00',
                        desligarTomada3H: aquario.desligarTomada3H ? aquario.horarios.desligarTomada3H : '00:00',
                        ligarTomada4H: aquario.ligarTomada4H ? aquario.horarios.ligarTomada4H : '00:00',
                        desligarTomada4H: aquario.desligarTomada4H ? aquario.horarios.desligarTomada4H : '00:00',
                    };
                });
                setAquarios(formattedData);
            } else {
                console.log('Nenhum dado encontrado para os aquários');
            }
        } catch (error) {
            console.error('Erro ao buscar os aquários:', error);
            Alert.alert('Erro', 'Não foi possível buscar os dados dos aquários.');
        }
    };
    const handlePerfilNav = () => {
        navigation.navigate('Perfil');
    };

    const handleCreateParans = () => {
        navigation.navigate('CreateParans');
    };
    const handleDashNoti = (aquario) => {
        navigation.navigate('DashNoti', {aquario});
    };

    const handleEditParans = (aquario) => {
        navigation.navigate('EditParans', {aquario});
    };
    
    const renderItem = ({ item }) => (
        <View style={styles.containerFlatList}>
            <View style={styles.containerFlatListTop}>
                <MaterialCommunityIcons name="lightbulb-on" size={20} color="black" />
                <Text>{item.name}</Text>
                <View style={styles.rowContainer}>
                    <TouchableWithoutFeedback onPress={() => handleEditParans(item)}>
                        <EvilIcons name="pencil" size={24} color="black" />
                    </TouchableWithoutFeedback>
                    <Feather name="bell" size={16} color="black" style={styles.marginIcon} />
                </View>
            </View>
            <TouchableWithoutFeedback onPress={() => handleDashNoti(item.id)}>
                <View style={styles.containerFlatListBottom}>
                    <View style={styles.rowContainer}>
                        <FontAwesome5 name="thermometer-three-quarters" size={20} color="black" style={styles.espacamentoIcon} />
                        <Text>{item.temperature}</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Entypo name="water" size={20} color="black" style={styles.espacamentoIcon} />
                        <Text>{item.fluxo}</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Image source={require('../img/ph.png')} style={[styles.imagePH, styles.espacamentoIcon]} />
                        <Text>{item.ph}</Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <FontAwesome6 name="glass-water-droplet" size={18} color="black" style={styles.espacamentoIcon} />
                        <Text>{item.nivel}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );    

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/backgroundDois.jpeg')} style={styles.backgroundImage}>
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)']}
                    style={styles.gradient}
                />
                <View style={styles.containerHeader}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.perfilNave} onPress={handlePerfilNav}>
                        <Image style={styles.imgPerfil} source={require('../img/iconPerfil.png')} />
                    </TouchableOpacity>
                    <Text style={styles.perfilText}>{user ? user.name : 'Carregando...'}</Text>
                </View>
                <View style={styles.containerList}>
                    <AntDesign name='pluscircleo' size={26} color='black' style={styles.iconAdd} onPress={handleCreateParans} />
                    {aquarios.length === 0 ? (
                        <Text style={styles.noDataText}>Nenhum aquário encontrado</Text>
                    ) : (
                        <FlatList
                            data={aquarios}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    )}
                </View>
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
    containerHeader: {
        marginTop: 36,
        flexDirection: 'row',
        marginLeft: -160,
    },
    perfilNave: {
        backgroundColor: '#D9D9D9',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#000',
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgPerfil: {
        width: 40,
        height: 40,
    },
    perfilText: {
        color: '#FFF',
        fontSize: 24,
        marginTop: 14,
        marginLeft: 10,
        textDecorationLine: 'underline',
        textDecorationColor: '#FFF',
    },
    containerList: {
        marginTop: 40,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(14,132,184,0.1)',
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 30,
    },
    iconAdd: {
        marginLeft: 350,
        marginTop: 16,
        width: 26,
        height: 26,
        borderRadius: 100,
        backgroundColor: '#FFF',
    },
    containerFlatList: {
        backgroundColor: '#86CBDB',
        width: 300,
        height: 75,
        borderRadius: 60,
        marginBottom: 30,
    },
    containerFlatListTop: {
        flexDirection: 'row',
        alignSelf: 'center',
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        paddingBottom: 6,
        marginTop: 8,
        justifyContent: 'space-between',
        width: 250,
    },
    containerFlatListBottom: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: 250,
        marginTop: 6,
    },
    rowContainer: {
        flexDirection: 'row'
    },
    marginIcon: {
        marginTop: 4,
    },
    imagePH: {
        width: 20,
        height: 20,
    },
    espacamentoIcon: {
        marginRight: 4,
    }
});

export default Home;