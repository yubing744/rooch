import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import ejs from 'ejs'
import prettier from 'prettier'
import { getType } from './utils.js'

<<<<<<< HEAD
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
=======
import { promises as fs } from "fs";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import ejs from "ejs";
import prettier from 'prettier';
import { getType } from "./utils.js";
import { getMappingFunc } from "./mapping.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
>>>>>>> main

export class Generator {
  constructor(opts) {
    this.openrpcDocument = opts.openrpcDocument
    this.outDir = opts.outDir
  }

  async execute() {
    const roochOpenRPCText = await fs.readFile(this.openrpcDocument, 'utf-8')
    const openRPCDoc = JSON.parse(roochOpenRPCText)
    const methods = openRPCDoc.methods
    const schemas = openRPCDoc.components.schemas

    await this.ensureOutputDir()

    await this.renderTemplate('types.ts', { schemas, getType })
    await this.renderTemplate('client.ts', { methods, schemas, getType })
    await this.renderTemplate('index.ts', {})
  }

  async ensureOutputDir() {
    try {
      await fs.access(this.outDir)
    } catch {
      await fs.mkdir(this.outDir, { recursive: true })
    }
  }

<<<<<<< HEAD
  async renderTemplate(template, data) {
    const templatePath = path.join(__dirname, 'template/' + template + '.ejs') // 模板文件路径
    const templateStr = await fs.readFile(templatePath, 'utf-8')
    const renderResult = ejs.render(templateStr, data)
    const prettyRenderResult = await prettier.format(renderResult, {
      parser: 'typescript',
    })
=======
    async execute() {
        const roochOpenRPCText = await fs.readFile(this.openrpcDocument, "utf-8");
        const openRPCDoc = JSON.parse(roochOpenRPCText);
        const methods = openRPCDoc.methods;
        const schemas = openRPCDoc.components.schemas;
        const mappingFunc = await getMappingFunc("name_mapping.json");
>>>>>>> main

    const note =
      '// This file was generated by `yarn gen:client`. Please, do not modify it.'
    const resultWithNote = `${note}\n${prettyRenderResult}\n${note}`

<<<<<<< HEAD
    await fs.writeFile(path.join(this.outDir, template), resultWithNote)
  }
}
=======
        await this.renderTemplate('types.ts', { schemas, getType, alias: mappingFunc })
        await this.renderTemplate('client.ts', { methods, schemas, getType, alias: mappingFunc })
        await this.renderTemplate('index.ts', {})
    }

    async ensureOutputDir() {
        try {
            await fs.access(this.outDir);
        } catch {
            await fs.mkdir(this.outDir, { recursive: true });
        }
    }

    async renderTemplate(template, data) {
        const templatePath = path.join(__dirname, 'template/' + template + '.ejs');  // 模板文件路径
        const templateStr = await fs.readFile(templatePath, 'utf-8');
        const renderResult = ejs.render(templateStr, data);
        const prettyRenderResult = await prettier.format(renderResult, { parser: "typescript" });

        const note = "// This file was generated by `yarn gen:client`. Please, do not modify it.";
        const resultWithNote = `${note}\n${prettyRenderResult}\n${note}`;

        await fs.writeFile(path.join(this.outDir, template), resultWithNote);
    }
}
>>>>>>> main
