#!/usr/bin/env node
const fs = require('fs');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const input = fs.readFileSync('./css/tailwind.css', 'utf-8');

postcss([
    tailwindcss('./tailwind.config.js'),
    autoprefixer
])
    .process(input, { from: './css/tailwind.css', to: './css/main.css' })
    .then(result => {
        fs.writeFileSync('./css/main.css', result.css);
        console.log('✓ CSS built successfully: css/main.css');
    })
    .catch(err => {
        console.error('Error building CSS:', err);
        process.exit(1);
    });
