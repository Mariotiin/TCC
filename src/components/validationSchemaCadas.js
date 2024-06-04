import * as yup from 'yup';

const isValidCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g,'');
    if (cpf === '' || cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;

    let add = 0;
    for (let i = 0; i < 9; i++) {
        add += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;

    add = 0;
    for (let i = 0; i < 10; i++) {
        add += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    return true;
};

const validationSchemaCadas = yup.object().shape({
    name: yup.string().required('Nome é obrigatório').matches(/^\S.*$/, 'Nome não pode começar com espaço').max(150, 'Nome muito longo'),
    password: yup
        .string()
        .required('Senha é obrigatória')
        .min(7, 'A senha deve ter no mínimo 7 caracteres')
        .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
        .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
        .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'A senha deve conter pelo menos um caractere especial')
        .matches(/^\S*$/, 'A senha não pode conter espaços'),
    confirmPassword: yup.string()
        .required('Confirmação de senha é obrigatória')
        .oneOf([yup.ref('password'), null], 'As senhas devem coincidir')
        .matches(/^\S*$/, 'A confirmação de senha não pode conter espaços'),
    email: yup.string().email('Email inválido').required('Email é obrigatório').test('email-completo', 'Email inválido', function(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    }).matches(/^\S*$/, 'O email não pode conter espaços'),
    cpf: yup.string().test('cpf-valido', 'CPF inválido', (value) => isValidCPF(value)).required('CPF é obrigatório'),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4,5}$/, 'Telefone inválido').required('Telefone é obrigatório')
});

export default validationSchemaCadas;