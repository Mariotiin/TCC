import React, { useState, useEffect, useContext } from 'react';
import { Text, View, ImageBackground, SafeAreaView, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome5, Octicons, Entypo, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const DashNoti = ({ route }) => {
    const navigation = useNavigation();
    const { aquario } = route.params;
    const aquarioId = aquario.id;

    const [dataInicial, setDataInicial] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateSelectionType, setDateSelectionType] = useState('inicial');
    const [notifications, setNotifications] = useState([]);

    const phValue = 6.5;
    const tempValue = 25;
    const flowLow = true;
    const waterLevelLow = true;
    const phMin = 7.0;
    const phMax = 8.0;
    const tempMin = 20;
    const tempMax = 30;
    const lightOn = true;
    const heaterOn = false;
    const socket3On = false;
    const socket4On = true;

    const handleBack = () => {
        navigation.navigate('Home');
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            if (dateSelectionType === 'inicial') {
                if (selectedDate <= dataFinal) {
                    setDataInicial(selectedDate);
                    setDateSelectionType('final');
                } else {
                    setDataInicial(dataFinal);
                    setDataFinal(selectedDate);
                    setDateSelectionType('final');
                }
            } else {
                if (selectedDate >= dataInicial) {
                    setDataFinal(selectedDate);
                } else {
                    setDataFinal(dataInicial);
                    setDataInicial(selectedDate);
                }
                setDateSelectionType('inicial');
            }
        }
    };

    useEffect(() => {
        const conditions = [
            { condition: phValue < phMin, message: "PH do Aquário está baixo" },
            { condition: phValue > phMax, message: "PH do Aquário está alto" },
            { condition: tempValue < tempMin, message: "Temperatura do Aquário está baixa" },
            { condition: tempValue > tempMax, message: "Temperatura do Aquário está alta" },
            { condition: flowLow, message: "Fluxo de água está baixo" },
            { condition: waterLevelLow, message: "Nível de água está baixo" },
            { condition: lightOn, message: "A luz está ligada" },
            { condition: !lightOn, message: "A luz está desligada" },
            { condition: heaterOn, message: "O aquecedor está ligado" },
            { condition: !heaterOn, message: "O aquecedor está desligado" },
            { condition: socket3On, message: "A tomada 3 está ligada" },
            { condition: !socket3On, message: "A tomada 3 está desligada" },
            { condition: socket4On, message: "A tomada 4 está ligada" },
            { condition: !socket4On, message: "A tomada 4 está desligada" }
        ];

        let newNotifications = [];
        let idCounter = 1;

        conditions.forEach(({ condition, message }) => {
            if (condition && newNotifications) {
                newNotifications.push({ id: idCounter++, message });
            }
        });

        setNotifications(newNotifications);
    }, [phValue, tempValue, flowLow, waterLevelLow, lightOn, heaterOn, socket3On, socket4On]);

    const data = [
        { key: '1', date: '19/05/2024', hora: '18:50', ph: '6,8', temperature: '27°C', aquecedor: true, luz: true, tomada3: true, tomada4: false, fluxo: true, glass: true },
        { key: '2', date: '18/05/2024', hora: '18:55', ph: '6,8', temperature: '27°C', aquecedor: true, luz: true, tomada3: true, tomada4: false, fluxo: true, glass: true },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.flatListHisto}>
            <View style={styles.rowContainer}>
                <Octicons name="clock" size={16} color="black" style={styles.iconTopMargin} />
                <Text style={styles.textFlatListHisto}>{item.date} - {item.hora}</Text>
            </View>
            <View style={styles.rowContainer}>
                <Image source={require('../img/ph.png')} style={styles.imageFlatList} />
                <Text style={styles.textFlatListHisto}>{item.ph}</Text>
            </View>
            <View style={styles.rowContainer}>
                <FontAwesome5 name="thermometer-three-quarters" size={16} color="black" style={styles.iconTopMargin} />
                <Text style={styles.textFlatListHisto}>{item.temperature}</Text>
            </View>
            <View style={styles.rowContainer}>
                {item.fluxo ? (
                    <Image source={require('../img/onFluxo.png')} style={styles.imageFlatList} />
                ) : (
                    <Image source={require('../img/fluxoOff.png')} style={styles.imageFlatList} />
                )}
            </View>
            <View style={styles.rowContainer}>
                {item.aquecedor ? (
                    <FontAwesome5 name="thermometer-three-quarters" size={16} color="black" style={styles.iconTopMargin} />
                ) : (
                    <MaterialCommunityIcons name="thermometer-off" size={16} color="black" />
                )}
            </View>
            <View style={styles.rowContainer}>
                {item.luz ? (
                    <MaterialCommunityIcons name="lightbulb-on" size={16} color="black" style={styles.iconTopMargin} />
                ) : (
                    <MaterialCommunityIcons name="lightbulb-off" size={24} color="black" />
                )}
            </View>
            <View style={styles.rowContainer}>
                {item.glass ? (
                    <FontAwesome6 name="glass-water-droplet" size={16} color="black" style={styles.iconTopMargin} />
                ) : (
                    <MaterialCommunityIcons name="glass-pint-outline" size={16} color="black" />
                )}
            </View>
            <View style={styles.rowContainer}>
                {item.tomada3 ? (
                    <MaterialIcons name="outlet" size={16} color="black" style={styles.iconTopMargin} />
                ) : (
                    <Image source={require('../img/outlet-off.png')} style={styles.imageFlatList} />
                )}
            </View>
            <View style={styles.rowContainer}>
                {item.tomada4 ? (
                    <MaterialIcons name="outlet" size={16} color="black" style={styles.iconTopMargin} />
                ) : (
                    <Image source={require('../img/outlet-off.png')} style={[styles.imageFlatList, styles.imageMargin]} />
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/backgroundDois.jpeg')} style={styles.backgroundImage}>
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.6)']}
                    style={styles.gradient}
                />
                <View style={styles.containerTop}>
                    <AntDesign name='left' size={60} color='#FFF' onPress={handleBack} />
                    <Text style={styles.textName}>Nome: Sala</Text>
                </View>
                <Text style={styles.textInfos}>Notificações:</Text>
                <View style={styles.containerFlatNoti}>
                    <FlatList
                        data={notifications}
                        renderItem={({ item }) => (
                            <View style={styles.flatListNoti}>
                                <Text style={styles.textFlatNoti}>{item.message}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>

                <View style={styles.containerRow}>
                    <Text style={[styles.textInfos, { flex: 1, textAlign: 'center' }]}>Histórico:</Text>
                    <FontAwesome5 name="calendar-alt" size={30} color="white" onPress={() => setShowDatePicker(true)} style={styles.iconConfig} />
                </View>
                <View style={styles.containerFlatHisto}>
                    <View style={styles.containerRowDatas}>
                        <Text style={styles.textDatas}>Data Inicial: {moment(dataInicial).format('DD/MM/YYYY')}</Text>
                        <Text style={styles.textDatas}>Data Final: {moment(dataFinal).format('DD/MM/YYYY')}</Text>
                    </View>
                    <FlatList
                        data={data.filter(item => {
                            const itemDate = moment(item.date, 'DD/MM/YYYY');
                            return itemDate.isSameOrAfter(moment(dataInicial), 'day') && itemDate.isSameOrBefore(moment(dataFinal), 'day');
                        })}
                        renderItem={renderItem}
                    />

                </View>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={dateSelectionType === 'inicial' ? dataInicial : dataFinal}
                        mode="date"
                        is24Hour={true}
                        display="calendar"
                        onChange={handleDateChange}
                    />
                )}
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
    containerTop: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: -200,
        marginBottom: 20,
    },
    textName: {
        color: '#FFF',
        fontSize: 20,
        marginTop: 15,
        marginLeft: 10,
    },
    containerFlatNoti: {
        width: 412,
        height: 260,
        backgroundColor: 'rgba(14,132,184,0.1)',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#000',
        padding: 10,
    },
    containerRow: {
        flexDirection: 'row',
        marginVertical: 10,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerFlatHisto: {
        width: 412,
        height: 382,
        backgroundColor: 'rgba(14,132,184,0.1)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 2,
        borderColor: '#000',
    },
    textInfos: {
        color: '#FFF',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 4,
    },
    containerRowDatas: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 340,
        marginTop: 20,
        marginBottom: 10,
    },
    textDatas: {
        color: '#FFF',
        fontSize: 12,
    },
    iconConfig: {
        marginTop: 20,
    },
    flatListNoti: {
        width: 360,
        height: 25,
        borderColor: '#000',
        borderRadius: 4,
        borderWidth: 2,
        backgroundColor: '#1E90FF',
        alignSelf: 'center',
        marginTop: 14,
        marginBottom: 4,
        justifyContent: 'center',
    },
    textFlatNoti: {
        fontSize: 16,
        textAlign: 'center',
        color: '#FFF',
    },
    flatListHisto: {
        width: 400,
        height: 22,
        backgroundColor: 'rgba(95,158,160,0.8)',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageFlatList: {
        width: 18,
        height: 18,
        marginTop: 3,
    },
    iconTopMargin: {
        marginTop: 3,
        marginRight: 4,
    },
    rowContainer: {
        flexDirection: 'row',
        marginLeft: 4,
    },
    textFlatListHisto: {
        marginTop: 1,
        color: '#FFF',
        marginLeft: 4,
    },
    imageMargin: {
        marginRight: 6,
    }
});

export default DashNoti;