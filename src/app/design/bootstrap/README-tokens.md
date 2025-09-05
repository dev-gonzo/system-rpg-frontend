# Bootstrap Color Tokens

Este documento explica o sistema de tokens CSS criado para sobrescrever as cores padrão do Bootstrap e eliminar cores hardcoded do projeto.

## Arquivos Criados

### `bootstrap-tokens.css`
Arquivo principal que define todos os tokens CSS para sobrescrever as variáveis padrão do Bootstrap.

## Tokens Disponíveis

### Cores Primárias do Bootstrap
```css
--bs-primary: var(--color-primary)
--bs-primary-rgb: var(--color-primary-rgb)
--bs-primary-bg-subtle: var(--color-primary-light)
--bs-primary-border-subtle: var(--color-primary-hover)
--bs-primary-text-emphasis: var(--color-primary)
```

### Cores Secundárias do Bootstrap
```css
--bs-secondary: var(--color-secondary)
--bs-secondary-rgb: 108, 117, 125
--bs-secondary-bg-subtle: var(--color-surface)
--bs-secondary-border-subtle: var(--color-border)
--bs-secondary-text-emphasis: var(--color-secondary)
```

### Cores de Estado
```css
--bs-success: #198754
--bs-danger: var(--color-error)
--bs-warning: #ffc107
--bs-info: #0dcaf0
```

### Cores de Layout
```css
--bs-body-color: var(--color-foreground)
--bs-body-bg: var(--color-background)
--bs-border-color: var(--color-border)
--bs-link-color: var(--color-primary)
--bs-link-hover-color: var(--color-primary-hover)
```

## Cores Hardcoded Corrigidas

### Antes (Hardcoded)
```css
/* Ícone do select - cor fixa */
stroke='%23343a40'

/* Ícone do select em foco - cor fixa */
stroke='%230d6efd'
```

### Depois (Com Tokens)
```css
/* Ícone do select - usa token */
stroke='var(--color-secondary)'

/* Ícone do select em foco - usa token */
stroke='var(--color-primary)'
```

## Componentes Bootstrap Sobrescritos

### Botões
- `.btn-primary` - Usa `var(--color-primary)`
- `.btn-secondary` - Usa `var(--color-secondary)`
- `.btn-outline-primary` - Usa `var(--color-primary)`

### Formulários
- `.form-control` - Usa tokens de background, foreground e border
- `.form-select` - Ícones usam tokens de cor
- Estados de validação usam `var(--color-error)`

### Alertas
- `.alert-primary` - Usa `var(--color-primary)`
- `.alert-danger` - Usa `var(--color-error)`

### Outros Componentes
- **Badges** - Usam tokens de cor primária e secundária
- **Progress bars** - Usam `var(--color-primary)`
- **Pagination** - Usa tokens de cor e border
- **Dropdowns** - Usam tokens de background e foreground
- **Modals** - Usam tokens de background e border
- **Tables** - Usam tokens para todas as cores
- **Cards** - Usam tokens de background e border
- **List groups** - Usam tokens para estados
- **Navigation** - Usa tokens de cor
- **Breadcrumbs** - Usa tokens de cor secundária

## Suporte a Temas

Os tokens são automaticamente ajustados para temas claro e escuro:

### Tema Claro
```css
:root[data-theme="light"] {
  --bs-border-color-translucent: rgba(0, 0, 0, 0.175);
  /* Outros tokens específicos do tema claro */
}
```

### Tema Escuro
```css
:root[data-theme="dark"] {
  --bs-border-color-translucent: rgba(255, 255, 255, 0.175);
  /* Outros tokens específicos do tema escuro */
}
```

## Como Usar

### 1. Importação Automática
O arquivo `bootstrap-tokens.css` é automaticamente importado no `base.css`:
```css
@import 'bootstrap/dist/css/bootstrap.min.css';
@import './bootstrap-tokens.css';
```

### 2. Usando Tokens em Componentes Customizados
```css
.meu-componente {
  background-color: var(--bs-primary);
  color: var(--bs-primary-contrast);
  border-color: var(--bs-border-color);
}
```

### 3. Sobrescrevendo Tokens Específicos
```css
:root {
  /* Personalizar cor de sucesso */
  --bs-success: #28a745;
  
  /* Personalizar cor de aviso */
  --bs-warning: #ffc107;
}
```

## Benefícios

1. **Consistência**: Todas as cores do Bootstrap agora seguem o sistema de design
2. **Manutenibilidade**: Mudanças de cor são centralizadas nos tokens
3. **Suporte a Temas**: Cores se adaptam automaticamente aos temas claro/escuro
4. **Sem Hardcode**: Eliminadas todas as cores fixas identificadas
5. **Compatibilidade**: Mantém total compatibilidade com classes Bootstrap existentes

## Próximos Passos

1. Testar todos os componentes Bootstrap na aplicação
2. Verificar se há outras cores hardcoded em outros arquivos
3. Documentar tokens customizados específicos do projeto
4. Criar guia de estilo visual com os tokens definidos