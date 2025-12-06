// vite-plugin-class-obfuscator-simple.js
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');


const classMap = new Map();

let globalStyleClasses = new Set();

function loadGlobalStyleClasses() {
  const styleDir = path.join(process.cwd(), 'src/common/style');

  if (!fs.existsSync(styleDir)) {
    // console.log(`全局样式目录不存在: ${styleDir}`);
    return;
  }

  try {

    function readStyleFiles(dir) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          readStyleFiles(fullPath);
        } else if (file.name.endsWith('.css') || 
                   file.name.endsWith('.scss') || 
                   file.name.endsWith('.less') || 
                   file.name.endsWith('.styl')) {
          
          const content = fs.readFileSync(fullPath, 'utf-8');
          extractClassesFromCSS(content);
        }
      }
    }


    function extractClassesFromCSS(css) {

      const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)(?![a-zA-Z0-9_-])/g;
      let match;
      
      while ((match = classRegex.exec(css)) !== null) {
        const className = match[1];
        globalStyleClasses.add(className);
      }
    }

    readStyleFiles(styleDir);
    // console.log(`加载了 ${globalStyleClasses.size} 个全局样式类名`);
    // console.log('全局样式类名:', Array.from(globalStyleClasses).slice(0, 10)); // 调试用
    
  } catch (error) {
    // console.warn('加载全局样式类名失败:', error);
  }
}

function obfuscateClassName(original) {
  if (!classMap.has(original)) {
    const hash = crypto.createHash('md5').update(original).digest('hex');
    let hashStr = 'c' + hash.slice(0, 7);
    classMap.set(original, hashStr);
  }
  return classMap.get(original);
}

export default function classObfuscatorSimplePlugin() {

  loadGlobalStyleClasses();

  return {
    name: 'vite-plugin-class-obfuscator-simple',
    enforce: 'pre',

    transform(code, id) {

      if (!id.endsWith('.vue')) {
        return null;
      }

      try {
        let result = code;

        const domUsedClasses = new Set();
        

        const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        if (scriptMatch) {
          const scriptContent = scriptMatch[1];
          

          const domClassPatterns = [
            /\.querySelector\s*\(\s*['"](?:\.([a-zA-Z_][a-zA-Z0-9_-]*))['"]/g,
            /\.querySelectorAll\s*\(\s*['"](?:\.([a-zA-Z_][a-zA-Z0-9_-]*))['"]/g,
            /\.getElementsByClassName\s*\(\s*['"]([a-zA-Z_][a-zA-Z0-9_-]*)['"]/g,
            /(?:document|el|this\.\$el|refs\.[a-zA-Z_][a-zA-Z0-9_]*|\$\w+)\.(?:querySelector|querySelectorAll)\s*\(\s*['"](?:\.([a-zA-Z_][a-zA-Z0-9_-]*))['"]/g,
            /(?:document|el|this\.\$el|refs\.[a-zA-Z_][a-zA-Z0-9_]*|\$\w+)\.getElementsByClassName\s*\(\s*['"]([a-zA-Z_][a-zA-Z0-9_-]*)['"]/g,
          ];
          
          domClassPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(scriptContent)) !== null) {
              const className = match[1] || match[2];
              if (className) {
                domUsedClasses.add(className);
              }
            }
          });

          const classSelectorRegex = /['"](?:\.([a-zA-Z_][a-zA-Z0-9_-]+))['"]/g;
          let selectorMatch;
          while ((selectorMatch = classSelectorRegex.exec(scriptContent)) !== null) {
            const className = selectorMatch[1];
            if (className && scriptContent.includes('querySelector') || 
                scriptContent.includes('querySelectorAll') ||
                scriptContent.includes('getElementsByClassName')) {
              const startIndex = Math.max(0, selectorMatch.index - 50);
              const context = scriptContent.substring(startIndex, selectorMatch.index);
              if (context.includes('querySelector') || 
                  context.includes('querySelectorAll') || 
                  context.includes('getElementsByClassName')) {
                domUsedClasses.add(className);
              }
            }
          }
        }
        
        // console.log(`在文件 ${path.basename(id)} 中发现 ${domUsedClasses.size} 个DOM方法使用的类名:`, 
        //   Array.from(domUsedClasses));

        const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
        if (templateMatch) {
          let template = templateMatch[1];

          template = template.replace(
            /\bclass="([^"{}\[\]\:]*?)"/g,
            (match, classString) => {
              if (!classString.trim()) {
                return match;
              }

              const classes = classString.trim().split(/\s+/);
              const obfuscated = classes
                .map(cls => {

                  if (globalStyleClasses.has(cls)) {
                    return cls;
                  }

                  if (domUsedClasses.has(cls)) {
                    return cls;
                  }
                  return obfuscateClassName(cls);
                })
                .join(' ');

              return `class="${obfuscated}"`;
            }
          );

          result = result.replace(
            /<template>[\s\S]*?<\/template>/,
            `<template>${template}</template>`
          );
        }


        result = result.replace(
          /<style[^>]*>([\s\S]*?)<\/style>/g,
          (match, styleContent) => {
            let css = styleContent;


            classMap.forEach((obfuscated, original) => {

              if (globalStyleClasses.has(original)) {
                return;
              }

              if (domUsedClasses.has(original)) {
                return;
              }

              const regex = new RegExp(`\\.${original}(?![a-zA-Z0-9_\\-])`, 'g');
              css = css.replace(regex, `.${obfuscated}`);
            });

            return match.replace(styleContent, css);
          }
        );

        return {
          code: result,
          map: null
        };
      } catch (error) {
        // console.warn(`处理文件 ${id} 时出错:`, error);
        return null;
      }
    }
  };
}