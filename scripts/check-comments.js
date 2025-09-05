#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configurações
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

class CommentChecker {
  constructor() {
    this.errors = [];
  }

  checkFile(filePath, content) {
    const ext = path.extname(filePath).toLowerCase();
    const relativePath = path.relative(process.cwd(), filePath);

    if (ext === '.html') {
      this.checkHtmlComments(relativePath, content);
    } else if (['.css', '.scss', '.sass'].includes(ext)) {
      this.checkCssComments(relativePath, content);
    }
  }

  checkHtmlComments(filePath, content) {
    const matches = content.matchAll(config.patterns.htmlComments);
    
    for (const match of matches) {
      const lines = content.substring(0, match.index).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      this.errors.push({
        file: filePath,
        line,
        column,
        message: 'HTML comments are not allowed',
        content: match[0].trim()
      });
    }
  }

  checkCssComments(filePath, content) {
    // Check for block comments
    const blockMatches = content.matchAll(config.patterns.cssComments.block);
    
    for (const match of blockMatches) {
      const lines = content.substring(0, match.index).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      this.errors.push({
        file: filePath,
        line,
        column,
        message: 'CSS block comments are not allowed',
        content: match[0].trim()
      });
    }

    // Check for line comments (but exclude URLs with //)
    const lineMatches = content.matchAll(config.patterns.cssComments.line);
    
    for (const match of lineMatches) {
      // Skip if it's part of a URL (data: or http://)
      const beforeMatch = content.substring(Math.max(0, match.index - 50), match.index);
      if (beforeMatch.includes('url(') || beforeMatch.includes('data:') || beforeMatch.includes('http')) {
        continue;
      }
      
      const lines = content.substring(0, match.index).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      this.errors.push({
        file: filePath,
        line,
        column,
        message: 'CSS line comments are not allowed',
        content: match[0].trim()
      });
    }
  }

  async scanDirectory() {
    const srcPath = path.join(process.cwd(), config.srcDir);
    
    if (!fs.existsSync(srcPath)) {
      console.error(`Source directory not found: ${srcPath}`);
      process.exit(1);
    }

    // Buscar arquivos HTML
    const htmlFiles = glob.sync(config.extensions.html, { cwd: srcPath });
    for (const file of htmlFiles) {
      const fullPath = path.join(srcPath, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      this.checkFile(fullPath, content);
    }

    // Buscar arquivos CSS/SCSS
    const cssFiles = glob.sync(config.extensions.css, { cwd: srcPath });
    for (const file of cssFiles) {
      const fullPath = path.join(srcPath, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      this.checkFile(fullPath, content);
    }
  }

  printResults() {
    if (this.errors.length === 0) {
      console.log(' No comments found in HTML and CSS files.');
      return true;
    }

    console.log(`\n Found ${this.errors.length} comment(s) that need to be removed:\n`);
    
    this.errors.forEach(error => {
      console.log(`${error.file}:${error.line}:${error.column}`);
      console.log(`  error  ${error.message}`);
      console.log(`  ${error.content}`);
      console.log('');
    });

    console.log(`\n${this.errors.length} error(s) found.`);
    return false;
  }
}

// Executar o verificador
async function main() {
  const checker = new CommentChecker();
  
  try {
    await checker.scanDirectory();
    const success = checker.printResults();
    
    if (!success) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Error checking comments:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CommentChecker;