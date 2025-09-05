# InputButtonComponent

Um componente reutilizável que combina um campo de entrada (input) com um botão, seguindo o padrão de design do projeto. Ideal para funcionalidades como consulta de CEP, busca, validação, etc.

## Uso Básico

```html
<app-form-input-button
  [control]="form.get('cep')"
  label="CEP"
  placeholder="Digite o CEP"
  mask="00000-000"
  buttonIcon="search"
  buttonAriaLabel="Consultar CEP"
  [buttonDisabled]="!isValidCep(form.get('cep')?.value)"
  [buttonLoading]="isLoading"
  (buttonClick)="onSearchCep($event)"
  [col]="4"
></app-form-input-button>
```

## Propriedades

### Propriedades do Input

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `control` | `FormControl<string \| null>` | - | **Obrigatório.** FormControl para controle do valor |
| `label` | `string` | `''` | Texto do rótulo do campo |
| `placeholder` | `string` | `''` | Texto de placeholder do input |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel'` | `'text'` | Tipo do input |
| `id` | `string` | - | ID personalizado para o input |
| `mask` | `string` | - | Máscara para formatação do input (ngx-mask) |
| `autocomplete` | `string` | `'off'` | Atributo autocomplete do input |
| `helper` | `string` | `''` | Texto de ajuda exibido abaixo do campo |
| `fieldName` | `string` | - | Nome do campo para referência |

### Propriedades do Botão

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `buttonText` | `string` | `''` | Texto do botão (usado quando não há ícone) |
| `buttonIcon` | `string` | `''` | Nome do ícone Material Design (ex: 'search') |
| `buttonDisabled` | `boolean` | `false` | Se o botão está desabilitado |
| `buttonLoading` | `boolean` | `false` | Se o botão está em estado de carregamento |
| `buttonAriaLabel` | `string` | `''` | Rótulo de acessibilidade do botão |

### Propriedades de Layout (herdadas de ColumnHostClass)

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `col` | `number \| string \| null` | Classe de coluna Bootstrap (col-*) |
| `colMd` | `number \| string \| null` | Classe de coluna Bootstrap para MD (col-md-*) |
| `colLg` | `number \| string \| null` | Classe de coluna Bootstrap para LG (col-lg-*) |
| `colXl` | `number \| string \| null` | Classe de coluna Bootstrap para XL (col-xl-*) |

## Eventos

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `blurEvent` | `EventEmitter<string>` | Emitido quando o input perde o foco (apenas se houver valor) |
| `buttonClick` | `EventEmitter<string \| null>` | Emitido quando o botão é clicado, passa o valor atual do input |

## Exemplos

### Consulta de CEP

```html
<app-form-input-button
  [control]="form.get('endereco.cep')"
  label="CEP"
  placeholder="00000-000"
  mask="00000-000"
  buttonIcon="search"
  buttonAriaLabel="Consultar CEP"
  [buttonDisabled]="!isValidCep(form.get('endereco.cep')?.value)"
  [buttonLoading]="isCepLoading()"
  (buttonClick)="consultarCep($event)"
  helper="Digite o CEP para buscar o endereço automaticamente"
  [col]="4"
></app-form-input-button>
```

### Campo de Busca

```html
<app-form-input-button
  [control]="searchControl"
  label="Buscar"
  placeholder="Digite sua busca..."
  buttonText="Buscar"
  buttonAriaLabel="Executar busca"
  [buttonLoading]="isSearching"
  (buttonClick)="onSearch($event)"
  [col]="6"
></app-form-input-button>
```

### Validação de Email

```html
<app-form-input-button
  [control]="form.get('email')"
  label="Email"
  placeholder="seu@email.com"
  type="email"
  buttonIcon="check"
  buttonAriaLabel="Validar email"
  [buttonDisabled]="!form.get('email')?.valid"
  [buttonLoading]="isValidatingEmail"
  (buttonClick)="validateEmail($event)"
  [col]="6"
></app-form-input-button>
```

## Estilização

O componente utiliza classes Bootstrap e segue o padrão visual do projeto:

- **Input**: Classe `form-control` com bordas conectadas ao botão
- **Botão**: Classe `btn btn-outline-secondary` com foco e hover apropriados
- **Estados**: Suporte completo para estados de erro, foco, desabilitado e carregamento
- **Responsividade**: Integração com sistema de grid do Bootstrap

## Acessibilidade

- Suporte completo a leitores de tela
- Navegação por teclado
- Rótulos apropriados com `aria-label`
- Estados visuais claros para diferentes condições

## Validação

O componente integra-se automaticamente com o sistema de validação do Angular Reactive Forms:

- Exibe mensagens de erro quando o campo é inválido e foi tocado
- Aplica classes CSS apropriadas para estados de erro
- Suporte a validadores customizados