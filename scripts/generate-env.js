const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

// Carrega as variáveis de ambiente do .env
const dotenvEnv = dotenv.config().parsed || {};

// Coleta todas as variáveis que começam com API_URL_
const apiUrls = {};
const prefix = 'API_URL_';

// Procura em process.env e dotenv por variáveis com o prefixo API_URL_
Object.keys({ ...process.env, ...dotenvEnv })
  .filter(key => key.startsWith(prefix))
  .forEach(key => {
    // Converte API_URL
    const propertyName = key.slice(prefix.length).toLowerCase();
    
    // Usa o valor do process.env ou do .env
    apiUrls[propertyName] = process.env[key] || dotenvEnv[key] || `http://localhost:8080/${propertyName}`;
  });

// Define o NODE_ENV
const nodeEnv = process.env.NODE_ENV || dotenvEnv.NODE_ENV || 'development';

// Gera o conteúdo do environment.ts
const content = `export const environment = {
  production: ${nodeEnv === 'production'},
  apis: {
    ${Object.entries(apiUrls)
      .map(([key, value]) => `${key}: '${value}'`)
      .join(',\n    ')}
  }
};
`;

const outputDir = path.resolve(__dirname, '../src/environments');
const outputPath = path.resolve(outputDir, 'environment.ts');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, content.trim());

console.log('!!!Environment.ts gerado com sucesso!');
