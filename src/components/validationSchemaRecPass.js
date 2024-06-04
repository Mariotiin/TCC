import * as yup from 'yup';

const validationSchemaRecPass = yup.object().shape({
    email: yup.string().email('Email inválido').required('Email é obrigatório').test('email-completo', 'Email inválido', function(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    }).matches(/^\S*$/, 'O email não pode conter espaços'),
});

export default validationSchemaRecPass;