import * as yup from 'yup';
import { parse, isValid, isBefore, differenceInYears } from 'date-fns';


export const demoSchema = yup.object({
  nome: yup.string().required('Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  telefone: yup.string().required('Telefone é obrigatório'),
  idade: yup.number().positive('Idade deve ser positiva').integer('Idade deve ser um número inteiro').required('Idade é obrigatória'),
  dataNascimento: yup.mixed<Date>()
    .required('Data de nascimento é obrigatória')
    .transform((value) => {
      
      if (value instanceof Date && isValid(value)) {
        return value;
      }
      
      
      if (typeof value === 'string' && value.trim()) {
        const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
        return isValid(parsedDate) ? parsedDate : new Date('invalid');
      }
      
      return new Date('invalid');
    })
    .test('is-valid-date', 'Data inválida', function(value) {
      return value instanceof Date && isValid(value);
    })
    .test('not-future', 'Data não pode ser futura', function(value) {
      if (!(value instanceof Date) || !isValid(value)) return false;
      return !isBefore(new Date(), value);
    })
    .test('min-age', 'Idade deve ser de pelo menos 10 anos', function(value) {
      if (!(value instanceof Date) || !isValid(value)) return false;
      const age = differenceInYears(new Date(), value);
      return age >= 10;
    }),
  senha: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
  estado: yup.string().required('Estado é obrigatório'),
  cidade: yup.string().required('Cidade é obrigatória'),
  aceitaTermos: yup.boolean().oneOf([true], 'Você deve aceitar os termos'),
  genero: yup.string().required('Gênero é obrigatório'),
  experiencia: yup.string().required('Nível de experiência é obrigatório'),
  habilidades: yup.array().of(yup.string()).min(1, 'Selecione pelo menos uma habilidade'),
  newsletter: yup.boolean(),
});

export type DemoFormData = yup.InferType<typeof demoSchema>;