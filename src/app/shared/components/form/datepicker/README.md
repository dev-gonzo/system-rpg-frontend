# Datepicker Component

Componente de seleção de data que segue o padrão dos outros componentes de formulário do projeto.

## Uso Básico

```html
<app-form-datepicker
  label="Data de Nascimento"
  [control]="form.get('dataNascimento')"
/>
```

## Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `control` | `FormControl<Date \| string \| null>` | - | **Obrigatório.** Controle do formulário |
| `label` | `string` | `''` | Rótulo do campo |
| `placeholder` | `string` | `'DD/MM/AAAA'` | Texto de placeholder |
| `id` | `string` | - | ID do elemento (gerado automaticamente se não fornecido) |
| `minDate` | `Date` | - | Data mínima permitida |
| `maxDate` | `Date` | - | Data máxima permitida |
| `dateFormat` | `string` | `'dd/mm/yyyy'` | Formato de exibição da data |
| `showButtonBar` | `boolean` | `false` | Exibe barra de botões (hoje, limpar) |
| `showIcon` | `boolean` | `true` | Exibe ícone de calendário |

## Propriedades de Layout (herdadas de ColumnHostClass)

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `col` | `number \| string` | Classes de coluna Bootstrap |
| `colMd` | `number \| string` | Classes de coluna Bootstrap para telas médias |
| `colLg` | `number \| string` | Classes de coluna Bootstrap para telas grandes |
| `colXl` | `number \| string` | Classes de coluna Bootstrap para telas extra grandes |

## Exemplos

### Com validação e data máxima

```html
<app-form-datepicker
  label="Data de Nascimento"
  placeholder="Selecione sua data de nascimento"
  [control]="form.get('dataNascimento')"
  [maxDate]="new Date()"
  colMd="6"
/>
```

### Com data mínima e máxima

```html
<app-form-datepicker
  label="Data do Evento"
  [control]="form.get('dataEvento')"
  [minDate]="new Date()"
  [maxDate]="dataMaximaEvento"
  [showButtonBar]="true"
  colMd="4"
/>
```

### Sem ícone

```html
<app-form-datepicker
  label="Data"
  [control]="form.get('data')"
  [showIcon]="false"
/>
```

## Validação

O componente funciona com as validações padrão do Angular Reactive Forms:

```typescript
this.form = this.fb.group({
  dataNascimento: ['', [Validators.required]],
  dataEvento: ['', [Validators.required, this.dataFuturaValidator]]
});
```

## Notas

- O componente utiliza o input HTML5 `type="date"` para melhor compatibilidade
- As datas são automaticamente convertidas para o formato ISO (YYYY-MM-DD) internamente
- O componente suporta tanto objetos `Date` quanto strings como valor
- Erros de validação são exibidos automaticamente abaixo do campo