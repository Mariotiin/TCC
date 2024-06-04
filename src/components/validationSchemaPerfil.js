import * as yup from 'yup';

const validationSchemaPerfil = yup.object().shape({
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4,5}$/, 'Telefone inválido').required('Telefone é obrigatório')
});

export default validationSchemaPerfil;