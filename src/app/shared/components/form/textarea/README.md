# TextareaComponent

Componente de textarea reutilizável que estende a funcionalidade do `ColumnHostClass` e integra com Angular Reactive Forms.

## Características

- ✅ Integração completa com Angular Reactive Forms
- ✅ Validação automática com exibição de erros
- ✅ Sistema de grid responsivo (Bootstrap)
- ✅ Suporte a diferentes tipos de redimensionamento
- ✅ Acessibilidade (labels, ids automáticos)
- ✅ Eventos personalizados
- ✅ Configuração flexível de linhas e colunas

## Uso Básico

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TextareaComponent } from './shared/components/form/textarea/textarea.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TextareaComponent],
  template: `
    <form [formGroup]="form">
      <app-textarea
        [control]="form.controls.description"
        label="Descrição"
        placeholder="Digite sua descrição aqui..."
        [rows]="4"
        [maxlength]="500"
        resize="vertical"
        [col]="12"
        [colMd]="8"
        [colLg]="6">
      </app-textarea>
    </form>
  `
})
export class ExampleComponent {
  form = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(10)])
  });
}
```

## Propriedades de Entrada

### Obrigatórias

| Propriedade | Tipo | Descrição |
|-------------|------|----------|
| `control` | `FormControl` | Controle do formulário reativo |
| `label` | `string` | Texto do label do campo |

### Opcionais

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|----------|
| `placeholder` | `string` | `''` | Texto de placeholder |
| `id` | `string` | `undefined` | ID personalizado (auto-gerado se não fornecido) |
| `autocomplete` | `string` | `'off'` | Atributo autocomplete |
| `helper` | `string` | `''` | Texto de ajuda |
| `fieldName` | `string` | `undefined` | Nome do campo para eventos |
| `rows` | `number` | `3` | Número de linhas visíveis |
| `cols` | `number` | `undefined` | Número de colunas |
| `maxlength` | `number` | `undefined` | Comprimento máximo do texto |
| `minlength` | `number` | `undefined` | Comprimento mínimo do texto |
| `resize` | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'vertical'` | Tipo de redimensionamento |

### Propriedades do Grid (herdadas de ColumnHostClass)

| Propriedade | Tipo | Descrição |
|-------------|------|----------|
| `col` | `number` | Colunas em telas pequenas |
| `colMd` | `number` | Colunas em telas médias |
| `colLg` | `number` | Colunas em telas grandes |
| `colXl` | `number` | Colunas em telas extra grandes |

## Eventos

| Evento | Tipo | Descrição |
|--------|------|----------|
| `blurEvent` | `EventEmitter<string>` | Emitido quando o campo perde o foco (se `fieldName` estiver definido) |

## Métodos Públicos

### `focus(): void`
Foca o elemento textarea programaticamente.

```typescript
@ViewChild(TextareaComponent) textarea!: TextareaComponent;

focusTextarea() {
  this.textarea.focus();
}
```

## Getters

### `inputId: string`
Retorna o ID do elemento (personalizado ou auto-gerado).

### `error: string | null`
Retorna a mensagem de erro atual do FormControl (se houver e o campo foi tocado).

## Exemplos de Uso

### Textarea Básico

```html
<app-textarea
  [control]="form.controls.description"
  label="Descrição"
  placeholder="Digite aqui...">
</app-textarea>
```

### Textarea com Validação

```typescript
// No componente
description = new FormControl('', [
  Validators.required,
  Validators.minLength(10),
  Validators.maxLength(500)
]);
```

```html
<app-textarea
  [control]="description"
  label="Descrição *"
  placeholder="Mínimo 10 caracteres"
  [minlength]="10"
  [maxlength]="500"
  [rows]="5"
  helper="Descreva detalhadamente o item">
</app-textarea>
```

### Textarea com Grid Responsivo

```html
<app-textarea
  [control]="form.controls.comments"
  label="Comentários"
  [col]="12"
  [colMd]="8"
  [colLg]="6"
  [rows]="4"
  resize="both">
</app-textarea>
```

### Textarea com Evento de Blur

```typescript
// No componente
onFieldBlur(fieldName: string) {
  console.log(`Campo ${fieldName} perdeu o foco`);
  // Lógica personalizada
}
```

```html
<app-textarea
  [control]="form.controls.notes"
  label="Observações"
  fieldName="notes"
  (blurEvent)="onFieldBlur($event)">
</app-textarea>
```

### Diferentes Tipos de Redimensionamento

```html
<!-- Sem redimensionamento -->
<app-textarea
  [control]="control1"
  label="Fixo"
  resize="none">
</app-textarea>

<!-- Redimensionamento vertical apenas -->
<app-textarea
  [control]="control2"
  label="Vertical"
  resize="vertical">
</app-textarea>

<!-- Redimensionamento horizontal apenas -->
<app-textarea
  [control]="control3"
  label="Horizontal"
  resize="horizontal">
</app-textarea>

<!-- Redimensionamento em ambas as direções -->
<app-textarea
  [control]="control4"
  label="Ambos"
  resize="both">
</app-textarea>
```

## Estrutura de Arquivos

```
textarea/
├── textarea.component.ts      # Lógica do componente
├── textarea.component.html    # Template
├── textarea.component.scss    # Estilos
├── textarea.component.spec.ts # Testes
└── README.md                  # Documentação
```

## Dependências

- `@angular/core`
- `@angular/forms`
- `@angular/common`
- `WrapperComponent` (componente interno)
- `ColumnHostClass` (classe base)

## Notas de Implementação

1. **ID Automático**: Se não fornecido, o ID é gerado automaticamente baseado no label
2. **Validação**: Integra automaticamente com as validações do FormControl
3. **Acessibilidade**: Labels são associados corretamente aos elementos
4. **Responsividade**: Utiliza o sistema de grid do Bootstrap
5. **Estilos**: Aplica classes CSS condicionalmente baseado no estado de validação

## Testes

O componente possui cobertura completa de testes incluindo:

- Renderização do componente
- Propriedades de entrada
- Getters e métodos
- Integração com FormControl
- Eventos
- Herança de ColumnHostClass
- Estados de validação

Para executar os testes:

```bash
npm test -- --include="**/textarea.component.spec.ts"
```