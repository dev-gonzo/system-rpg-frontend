# Scripts de Verificação

## check-comments.js

Este script verifica e bloqueia todos os tipos de comentários em arquivos HTML, CSS e SCSS do projeto.

### Funcionalidades

- **Comentários HTML**: Detecta e bloqueia comentários `<!-- -->`
- **Comentários CSS**: Detecta e bloqueia comentários de bloco `/* */` e de linha `//`
- **Integração com ESLint**: Executa automaticamente antes do ESLint
- **Integração com Husky**: Executa automaticamente nos commits via lint-staged

### Tipos de comentários bloqueados

#### HTML
```html
<!-- Este comentário será bloqueado -->
<div>Conteúdo</div>
```

#### CSS/SCSS
```css
/* Este comentário de bloco será bloqueado */
.classe {
  color: red; // Este comentário de linha será bloqueado
}
```

### Como usar

#### Verificação manual
```bash
npm run check-comments
```

#### Verificação integrada com linting
```bash
npm run lint        # Executa check-comments + ESLint com correção automática
npm run lint:check  # Executa check-comments + ESLint apenas para verificação
```

#### Verificação automática nos commits
O script é executado automaticamente via Husky quando você faz commit de arquivos `.ts`, `.html`, `.css` ou `.scss`.

### Configuração

O script verifica os seguintes diretórios e extensões:
- **Diretório**: `src/`
- **Extensões HTML**: `**/*.html`
- **Extensões CSS**: `**/*.css`, `**/*.scss`, `**/*.sass`

### Saída do script

#### Sucesso (sem comentários encontrados)
```
 No comments found in HTML and CSS files.
```

#### Erro (comentários encontrados)
```
 Found 2 comment(s) that need to be removed:

src/app/demo/demo.page.html:134:1
  error  HTML comments are not allowed
  <!-- Seção de Demonstração de Toasts -->

src/app/shared/datepicker/datepicker.component.scss:52:3
  error  CSS line comments are not allowed
  // Estado de foco para o grupo inteiro

2 error(s) found.
```

### Integração com CI/CD

O script retorna:
- **Exit code 0**: Quando nenhum comentário é encontrado
- **Exit code 1**: Quando comentários são encontrados

Isso permite que o CI/CD falhe automaticamente se comentários forem encontrados no código.

### Personalização

Para modificar as regras de verificação, edite as configurações no início do arquivo `check-comments.js`:

```javascript
const config = {
  srcDir: 'src',
  extensions: {
    html: ['**/*.html'],
    css: ['**/*.css', '**/*.scss', '**/*.sass']
  },
  patterns: {
    htmlComments: /<!--[\s\S]*?-->/g,
    cssComments: {
      block: /\/\*[\s\S]*?\*\//g,
      line: /\/\/.*$/gm
    }
  }
};
```