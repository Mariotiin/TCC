import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CadastroButton = ({title, onPressButton, corFundo}) => {
    
    const style = StyleSheet.create({
        button: {
            margin: 16,
            paddingTop: 2,
            borderRadius: 30,
            borderWidth: 1,
            height: 34,
            width: 156,
            backgroundColor: corFundo,
            alignItems: 'center',
        },
        textButton: {
            color: '#000',
            fontSize: 20,
        }
    })

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPressButton}>
        <View style={style.button}>
            <Text style={style.textButton}>{title}</Text>
        </View>
    </TouchableOpacity>
  );
}

export default CadastroButton;