npm init  == pack json 
npm i express ==

npm install typescript --save-dev
npm install @babel/cli @babel/core @babel/preset-env @babel/preset-typescript --save-dev

## TSCONFIG

{
"compilerOptions": {
"target": "es6",
"module": "commonjs",
"outDir": "dist",
"strict": true,
"esModuleInterop": true
},
"include": ["src"]
}

### babelRC

{
"presets": [
"@babel/preset-env",
"@babel/preset-typescript"
]
}

##package script
{
"scripts": {
"build": "tsc",
"start": "node dist/index.js"
}
}
npm i body-parser

npm i uuidv4

npm i @types/node

npm i jsonwebtoken