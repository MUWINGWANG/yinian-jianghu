#!/bin/bash
git -C /Users/lifeiyang/Desktop/yinian-jianghu init
git -C /Users/lifeiyang/Desktop/yinian-jianghu add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html src/
git -C /Users/lifeiyang/Desktop/yinian-jianghu commit -m "chore: init Vite + Vue 3 + Pinia + TypeScript + Vitest"
