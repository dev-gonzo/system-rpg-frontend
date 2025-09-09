# NumberInputComponent

Um componente de input numérico especializado com controles de incremento/decremento, suporte a inteiros, decimais e valores monetários.

## Uso Básico

```html
<app-form-number-input
  [control]="form.get('quantidade')"
  label="Quantidade"
  placeholder="Digite a quantidade"
  numberType="integer"
  [min]="1"
  [max]="100"
  [col]="4"
></app-form-number-input>
```

## Propriedades

### Propriedades Principais

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `control` | `FormControl<number \| null>` | - | **Obrigatório.** FormControl para controle do valor |
| `label` | `string` | `''` | Texto do rótulo do campo |
| `placeholder` | `string` | `''` | Texto de placeholder do input |
| `numberType` | `'integer' \| 'decimal' \| 'currency'` | `'decimal'` | Tipo de número (inteiro, decimal ou monetário) |
| `min` | `number` | - | Valor mínimo permitido |
| `max` | `number` | - | Valor máximo permitido |
| `step` | `number` | `1` | Valor do incremento/decremento |
| `decimalPlaces` | `number` | `2` | Número de casas decimais |
| `currencySymbol` | `string` | `'R$'` | Símbolo da moeda (usado apenas para exibição) |
| `disabled` | `boolean` | `false` | Se o componente está desabilitado |
| `id` | `string` | - | ID personalizado para o input |
| `helper` | `string` | `''` | Texto de ajuda exibido abaixo do campo |
| `fieldName` | `string` | - | Nome do campo para referência |

### Propriedades de Layout (herdadas de ColumnHostClass)

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `col` | `number \| string` | Classes de coluna Bootstrap |
| `colMd` | `number \| string` | Classes de coluna Bootstrap para telas médias |
| `colLg` | `number \| string` | Classes de coluna Bootstrap para telas grandes |
| `colXl` | `number \| string` | Classes de coluna Bootstrap para telas extra grandes |

### Eventos

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `blurEvent` | `EventEmitter<string>` | Emitido quando o campo perde o foco |
| `valueChange` | `EventEmitter<number \| null>` | Emitido quando o valor é alterado |

## Tipos de Número

### Integer (Inteiro)
```html
<app-form-number-input
  [control]="form.get('idade')"
  label="Idade"
  numberType="integer"
  [min]="0"
  [max]="120"
></app-form-number-input>
```

### Decimal
```html
<app-form-number-input
  [control]="form.get('peso')"
  label="Peso (kg)"
  numberType="decimal"
  [decimalPlaces]="2"
  [min]="0"
  [step]="0.1"
></app-form-number-input>
```

### Currency (Monetário)
```html
<app-form-number-input
  [control]="form.get('preco')"
  label="Preço"
  numberType="currency"
  [min]="0"
  currencySymbol="R$"
></app-form-number-input>
```

## Exemplos Avançados

### Com validação e eventos
```html
<app-form-number-input
  [control]="form.get('quantidade')"
  label="Quantidade"
  numberType="integer"
  [min]="1"
  [max]="999"
  helper="Quantidade deve ser entre 1 e 999"
  (valueChange)="onQuantidadeChange($event)"
  (blurEvent)="onFieldBlur($event)"
  [col]="6"
></app-form-number-input>
```

### Desabilitado condicionalmente
```html
<app-form-number-input
  [control]="form.get('desconto')"
  label="Desconto (%)"
  numberType="decimal"
  [decimalPlaces]="2"
  [min]="0"
  [max]="100"
  [disabled]="!isDescontoPermitido"
></app-form-number-input>
```

## Funcionalidades

- **Controles visuais**: Botões de incremento (+) e decremento (-)
- **Validação de limites**: Respeita valores mínimo e máximo
- **Formatação automática**: Formata valores conforme o tipo selecionado
- **Suporte a teclado**: Funciona com entrada manual via teclado
- **Acessibilidade**: Labels apropriados para leitores de tela
- **Responsivo**: Integração com sistema de grid do Bootstrap
- **Validação**: Integração completa com Angular Reactive Forms

## Comportamento dos Tipos

### Integer
- Aceita apenas números inteiros
- Remove casas decimais automaticamente
- Step padrão: 1

### Decimal
- Aceita números com casas decimais
- Limita casas decimais conforme `decimalPlaces`
- Step padrão: baseado em `decimalPlaces`

### Currency
- Formata como moeda brasileira (R$)
- Sempre 2 casas decimais
- Step fixo: 0.01
- Formatação com separadores de milhares

## Integração com Formulários

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ExemploComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      quantidade: [1, [Validators.required, Validators.min(1)]],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      desconto: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  onQuantidadeChange(value: number | null): void {
    console.log('Nova quantidade:', value);
  }
}
```